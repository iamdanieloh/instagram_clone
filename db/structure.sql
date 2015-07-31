drop table if exists users;
create table users (
  id serial primary key,
  email_address varchar(255),
  password_hash varchar(255),
  created_at timestamp,
  updated_at timestamp
);
