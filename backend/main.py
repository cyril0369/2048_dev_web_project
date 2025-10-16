from typing import Annotated
from fastapi import Depends, FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Field, Session, SQLModel, create_engine, select


class Games(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    grille: str
    score: int


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

# Ajout du middleware CORS
app.add_middleware(
    CORSMiddleware,
    # Autorise toutes les origines, à adapter selon tes besoins
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/games/", response_model=Games)
def create_game(game: Games, session: SessionDep) -> Games:
    session.add(game)
    session.commit()
    session.refresh(game)
    return game


@app.get("/games/", response_model=list[Games])
def read_games(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 5,
    sort_by: str = "score",
    order: Annotated[str, Query(regex="^(asc|desc)$")] = "desc",
) -> list[Games]:
    if not hasattr(Games, sort_by):
        raise HTTPException(
            status_code=400, detail=f"Invalid sort field: {sort_by}"
            )
    column = getattr(Games, sort_by)
    order_expr = column.desc() if order == "desc" else column.asc()
    games = session.exec(
        select(Games).order_by(order_expr).offset(offset).limit(limit)
        ).all()
    return games


@app.delete("/games/{game_id}", response_model=Games)
def delete_game(game_id: int, session: SessionDep) -> Games:
    game = session.get(Games, game_id)
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    session.delete(game)
    session.commit()
    return game


@app.delete("/games/", response_model=int)
def delete_all_games(session: SessionDep) -> int:
    games = session.exec(select(Games)).all()
    count = len(games)
    for game in games:
        session.delete(game)
    session.commit()
    return count


@app.get("/games/best_score", response_model=int)
def get_best_score(session: SessionDep) -> int:
    best_score = session.exec(select(Games.score)).all()
    if not best_score:
        raise HTTPException(status_code=404, detail="No games found")
    return max(best_score)
