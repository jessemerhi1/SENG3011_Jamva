from ast import excepthandler
from datetime import datetime
from fastapi.responses import JSONResponse

try:
    from articleEndPoints import dereferenceReports
except:
    from .articleEndPoints import dereferenceReports
import json
import re

# returns a json response


def toJsonResponse(statusCode, content):
    return JSONResponse(
        status_code=statusCode,
        # "default=str" to convert datetimewithnanoseconds to string
        content=json.loads(json.dumps(content, default=str)),
    )


def newQuiz(db, quiz):
    try:
        query = db.collection("quizzes").add(quiz)
        print(query)
        return toJsonResponse(200, "Success")
    except:
        return toJsonResponse(500, "Unable to fetch from database")


def fetchQuizzes(db):
    try:
        query = db.collection("quizzes").get()
        quizzes = []
        for quiz in query:
            dictionary = quiz.to_dict()
            dictionary["id"] = quiz.id
            quizzes.append(dictionary)

        return toJsonResponse(200, quizzes)
    except:
        return toJsonResponse(500, "Unable to fetch from database")
