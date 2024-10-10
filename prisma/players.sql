CREATE TABLE players (
    Id UUID PRIMARY KEY;
    Name VARCHAR(255) NOT NULL DEFAULT '',
    TotalScore FLOAT DEFAULT 0.0,
    RawScore FLOAT DEFAULT 0.0,
    Games INT DEFAULT 0,
    FirstNum INT DEFAULT 0,
    SecondNum INT DEFAULT 0,
    ThirdNum INT DEFAULT 0,
    FourthNum INT DEFAULT 0,
    MaxScore INT DEFAULT -100000,
    Deposition INT DEFAULT 0,
    Deleted BOOLEAN DEFAULT false,
    UserId UUID
);