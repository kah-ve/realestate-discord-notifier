from flask import Flask, jsonify, make_response, request
from flask_cors import CORS, cross_origin
import json
from Database import Database as db
from mylogger import get_logger
import scraper

logger = get_logger()


app = Flask(__name__)
CORS(app, support_credentials=True)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/api/gethomes", methods=["GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def get_homes():
    zipcode = request.args.get("zipcode", default="08016", type=str)
    print(f"Received zipcode from frontend: {zipcode}")

    return jsonify(scraper.get_site_urls(zipcode))


@app.route("/api/insert", methods=["POST"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def insert_data():

    data = json.loads(request.data)  # type: ignore
    logger.info(f"The request data to insert: {data}")

    count = db.get_count_by_date(data["date"])
    if count == 1:
        logger.info(f"Updating only! Temperature key already exists!")
        db.update_date(data)
    else:
        logger.info(f"Inserting new entry!")

        # Insert
        db.insert_data(data)

    # print(, file=sys.stderr)
    return ""


@app.route("/api/getinfo", methods=["GET"])
@cross_origin(origin="*", headers=["Content-Type", "Authorization"])
def get_data():
    """Return a sample JSON response."""
    output = db.get_all_rows()
    logger.info(f"The output is {output}")

    # output = make_response(jsonify(output))
    output = jsonify(output)
    return output


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({"error": "Not found"}), 404)
