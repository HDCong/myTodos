
CREATE TABLE details (
  id SERIAL PRIMARY KEY,
  content VARCHAR(255) NOT NULL,
  isDone BOOLEAN DEFAULT 'f'
);

INSERT INTO details(content,isDone) VALUES ('Làm deadline','f');