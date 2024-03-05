CREATE TABLE games (
    Date DATE,
    Games INT DEFAULT 0,
    EastPlayer INT REFERENCES players(id),
    EastPlayerScore INT DEFAULT 0,
    SouthPlayer INT REFERENCES players(id),
    SouthPlayerScore INT DEFAULT 0,
    WestPlayer INT REFERENCES players(id),
    WestPlayerScore INT DEFAULT 0,
    NorthPlayer INT REFERENCES players(id),
    NorthPlayerScore INT DEFAULT 0
);
