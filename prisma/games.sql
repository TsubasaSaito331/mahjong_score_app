CREATE TABLE games (
    Id UUID PRIMARY KEY,
    Date DATE,
    EastPlayer UUID  REFERENCES players(id),
    EastPlayerScore INT DEFAULT 0,
    SouthPlayer UUID  REFERENCES players(id),
    SouthPlayerScore INT DEFAULT 0,
    WestPlayer UUID  REFERENCES players(id),
    WestPlayerScore INT DEFAULT 0,
    NorthPlayer UUID  REFERENCES players(id),
    NorthPlayerScore INT DEFAULT 0,
    UserId UUID
);
