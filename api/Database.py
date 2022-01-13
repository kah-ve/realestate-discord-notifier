import psycopg2
from mylogger import get_logger

logger = get_logger()


class Database:
    table_created = False
    table_name = "homes"

    @classmethod
    def get_connection(cls):
        logger.info(f"Opening connection...")

        con = psycopg2.connect(
            database="re_db",
            user="postgres",
            password="password",
            host="db",
            port="5432",
        )

        return con

    @classmethod
    def create_table(cls):
        logger.info(f"Creating the table...")

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute(
                    f"""CREATE TABLE IF NOT EXISTS {cls.table_name}"""
                    f"""(DATE TEXT PRIMARY KEY NOT NULL,"""
                    f"""TEMPERATURE INT NOT NULL,"""
                    f"""PRECIPITATION INT NOT NULL,"""
                    f"""CLIMATE TEXT ,"""
                    f"""DESCRIPTION TEXT );"""
                )

                cls.table_created = True

    @classmethod
    def __ensure_table_exist(cls):
        if not cls.table_created:
            logger.info(f"The table does not exist!")
            cls.create_table()
        else:
            logger.info(f"Table exists.")

    @classmethod
    def insert_data(cls, params):
        cls.__ensure_table_exist()

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:

                cur.execute(
                    f"""INSERT INTO homes"""
                    f""" VALUES ("""
                    f"""'{params['date']}', """
                    f"""{params['temperature']},"""
                    f"""{params['precipitation']},"""
                    f"""'{params['climate']}',"""
                    f"""'{params['description']}');"""
                )

    @classmethod
    def get_count_by_date(cls, date: str) -> int:
        cls.__ensure_table_exist()

        logger.info(f"Getting count by date...")

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute(f"SELECT count(*) FROM homes WHERE date='{date}';")

                fetch_one = cur.fetchone()
                count = fetch_one[0]
                logger.info(f"The count of existing entries. {count}")

                return count

    @classmethod
    def update_date(cls, params):
        logger.info(f"Updating with params {params}...")

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:

                cur.execute(
                    f"""UPDATE homes """
                    f"""SET date='{params['date']}',"""
                    f"""temperature={params['temperature']},"""
                    f"""precipitation={params['precipitation']},"""
                    f"""climate='{params['climate']}',"""
                    f"""description='{params['description']}' """
                    f"""WHERE date='{params['date']}';"""
                )

    @classmethod
    def get_all_rows(cls):
        if not cls.table_created:
            logger.info(f"The table does not exist!")
            cls.create_table()
            return {}

        con = Database.get_connection()

        with con:
            with con.cursor() as cur:
                cur.execute("SELECT * FROM homes;")
                output = cur.fetchall()
                return output
