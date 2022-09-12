CREATE TABLE IF NOT EXISTS users (
    id bigserial primary key,
    name text not null,
    email text not null unique,
    password_hash text,
    role int not null,
    rating int,
    profile_picture text
);

CREATE TABLE IF NOT EXISTS posts (
    id bigserial primary key,
    author bigserial REFERENCES users(id) on delete cascade,
    title text not null,
    publish_date timestamp without time zone,
    status boolean default true,
    content text not null,
    categories varchar[],
    is_edited boolean default false
);

CREATE TABLE IF NOT EXISTS categories (
    id bigserial primary key,
    title text not null unique,
    description text not null
);

CREATE TABLE IF NOT EXISTS comments (
    id bigserial primary key,
    author bigserial REFERENCES users(id) on delete cascade,
    post bigserial REFERENCES posts(id) on delete cascade,
    publish_date timestamp without time zone,
    content text not null,
    is_edited boolean default false
);

CREATE TYPE like_type as enum ('post', 'comment');

CREATE TABLE IF NOT EXISTS post_likes (
    id bigserial primary key,
    author bigserial REFERENCES users(id) on delete cascade,
    publish_date timestamp without time zone,
    post_id bigserial REFERENCES posts(id) on delete cascade,
    liked_on like_type,
    is_dislike boolean default false
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id bigserial primary key,
    author bigserial REFERENCES users(id) on delete cascade,
    publish_date timestamp without time zone,
    comment_id bigserial REFERENCES comments(id) on delete cascade,
    liked_on like_type,
    is_dislike boolean default false
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    token varchar(256) primary key,
    owner_id bigint references users (id) on delete cascade,
    due_date timestamp without time zone
)
