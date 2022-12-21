--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    email text NOT NULL,
    token text NOT NULL,
    "createdAt" date DEFAULT now()
);


--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: signUp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."signUp" (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "confirmPassword" text NOT NULL,
    "createdAt" date DEFAULT now()
);


--
-- Name: signUp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."signUp_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: signUp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."signUp_id_seq" OWNED BY public."signUp".id;


--
-- Name: urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.urls (
    id integer NOT NULL,
    "shortUrl" text NOT NULL,
    url text NOT NULL,
    "userId" integer NOT NULL,
    "visitCount" integer DEFAULT 0,
    "createdAt" date DEFAULT now()
);


--
-- Name: urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.urls_id_seq OWNED BY public.urls.id;


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: signUp id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."signUp" ALTER COLUMN id SET DEFAULT nextval('public."signUp_id_seq"'::regclass);


--
-- Name: urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls ALTER COLUMN id SET DEFAULT nextval('public.urls_id_seq'::regclass);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES (1, 1, 'paulohcsbh@gmail.com', '9464aa52-b495-412d-8156-10564674d91c', '2022-12-19');
INSERT INTO public.sessions VALUES (2, 3, 'paulohcsbh@hotmail.com', '1e5045a0-2efd-4868-934a-2144960ffd89', '2022-12-19');
INSERT INTO public.sessions VALUES (4, 6, 'amandamichaellyst@gmail.com', '6287bb1d-d3de-4490-8d5f-9b2659ec1d22', '2022-12-19');
INSERT INTO public.sessions VALUES (6, 7, 'gusse@dog.com', 'd4c6a04e-f425-4cd5-8a4a-589c6d81d0af', '2022-12-20');


--
-- Data for Name: signUp; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."signUp" VALUES (1, 'Paulo', 'paulohcsbh@gmail.com', '$2b$10$zUBq22yiciN7iyxaIbIt6OxZds63lXzNbl5K8tl6MNRGnlXIO7wWu', '$2b$10$zUBq22yiciN7iyxaIbIt6OxZds63lXzNbl5K8tl6MNRGnlXIO7wWu', '2022-12-19');
INSERT INTO public."signUp" VALUES (3, 'Paulo', 'paulohcsbh@hotmail.com', '$2b$10$wHJifMypIVAs7f4x.1DlRe0SrMCo.KZSbaxnxStYw5mmxUDijQ11.', '$2b$10$wHJifMypIVAs7f4x.1DlRe0SrMCo.KZSbaxnxStYw5mmxUDijQ11.', '2022-12-19');
INSERT INTO public."signUp" VALUES (6, 'Amanda', 'amandamichaellyst@gmail.com', '$2b$10$DcMi20O61hCvL4jJq4Ayl.RsprNDZkEvf27veOsXF3WtksNEeCXxq', '$2b$10$DcMi20O61hCvL4jJq4Ayl.RsprNDZkEvf27veOsXF3WtksNEeCXxq', '2022-12-19');
INSERT INTO public."signUp" VALUES (7, 'Gusse', 'gusse@dog.com', '$2b$10$Mcs5qVOcXK3QrDIwV6aEUuditQsamCtfqdemfD/jpskcmOJTNka/i', '$2b$10$Mcs5qVOcXK3QrDIwV6aEUuditQsamCtfqdemfD/jpskcmOJTNka/i', '2022-12-20');


--
-- Data for Name: urls; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.urls VALUES (3, 's--_NoFd', 'https://www.facebook.com', 1, 2, '2022-12-20');
INSERT INTO public.urls VALUES (2, '1nJ-GGqq', 'https://www.instagram.com', 1, 1, '2022-12-20');
INSERT INTO public.urls VALUES (4, 'ZcB-jgJp', 'https://www.facebook.com', 6, 2, '2022-12-20');
INSERT INTO public.urls VALUES (6, 'rb4InLsQ', 'https://www.facebook.com', 6, 0, '2022-12-20');
INSERT INTO public.urls VALUES (5, 'SmnG2ui7', 'https://www.facebook.com', 3, 4, '2022-12-20');
INSERT INTO public.urls VALUES (8, 'trJYCJnj', 'https://github.com', 7, 0, '2022-12-21');


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sessions_id_seq', 6, true);


--
-- Name: signUp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."signUp_id_seq"', 7, true);


--
-- Name: urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.urls_id_seq', 8, true);


--
-- Name: sessions sessions_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_email_key UNIQUE (email);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: signUp signUp_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."signUp"
    ADD CONSTRAINT "signUp_email_key" UNIQUE (email);


--
-- Name: signUp signUp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."signUp"
    ADD CONSTRAINT "signUp_pkey" PRIMARY KEY (id);


--
-- Name: urls urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.urls
    ADD CONSTRAINT urls_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

