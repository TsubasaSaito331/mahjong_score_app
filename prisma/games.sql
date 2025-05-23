CREATE TABLE games (
    Id UUID PRIMARY KEY,
    Date DATETIME,
    EastPlayer UUID  REFERENCES players(id),
    EastPlayerScore INT DEFAULT 0,
    SouthPlayer UUID  REFERENCES players(id),
    SouthPlayerScore INT DEFAULT 0,
    WestPlayer UUID  REFERENCES players(id),
    WestPlayerScore INT DEFAULT 0,
    NorthPlayer UUID  REFERENCES players(id),
    NorthPlayerScore INT DEFAULT 0,
    Deleted BOOLEAN DEFAULT false,
    UserId UUID
);
