import logging
import logging.config

logger = logging.getLogger("apiLogger")
logger.setLevel(logging.DEBUG)

file_handler = logging.FileHandler("apiLogs.log")
file_handler.setLevel(logging.INFO)
logger.addHandler(file_handler)


def get_logger(name="apiLogger"):
    return logging.getLogger(name)
