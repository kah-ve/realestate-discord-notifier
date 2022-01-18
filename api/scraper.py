import logging
from xml.dom.minidom import Element
from bs4.element import PageElement
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium import webdriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

import undetected_chromedriver as uc
import os
from dotenv import load_dotenv
import requests
import json
import time
import datetime
import pytz
import sys
import random
import calendar
from typing import Dict, List, Tuple

from bs4 import BeautifulSoup as bs
import numpy as np
import pandas as pd
import regex as re
import requests
import lxml
from lxml.html.soupparser import fromstring, parse
import prettify
import numbers
import htmltext
import re

from typing import Set, List

load_dotenv()


class Scraper:
    @classmethod
    def get_driver(cls) -> WebDriver:
        options = webdriver.ChromeOptions()
        options.headless = True

        # options.add_argument("window-size=1920x1080")
        # options.add_argument("--no-sandbox")
        # options.add_argument("--disable-gpu")
        # options.add_argument("--disable-dev-shm-usage")  # Not used
        driver = uc.Chrome(options=options)
        # driver = uc.Chrome()

        return driver


def get_site_urls(zipcode: str):
    req_headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    }

    # with requests.Session() as s:
    #     # city = "philadelphia/"  # *****change this city to what you want*****
    #     # url = "https://www.zillow.com/homes/for_sale/" + city
    #     url = f"https://www.zillow.com/homes/{zipcode}_rb/"
    #     r = s.get(url, headers=req_headers)

    # # with open("soup-example.html", "w") as f:
    # #      f.write(r.text)

    with open("soup-example.html") as f:
        soup = bs(f, "html.parser")

    # soup = bs(r.content, "html.parser")

    # df = pd.DataFrame()

    # # all for loops are pulling the specified variable using beautiful soup and inserting into said variable
    # address = soup.find_all(class_="list-card-addr")
    # price = list(soup.find_all(class_="list-card-price"))
    # beds = list(soup.find_all("ul", class_="list-card-details"))
    # details = soup.find_all("div", {"class": "list-card-details"})
    # home_type = soup.find_all("div", {"class": "list-card-footer"})
    # last_updated = soup.find_all("div", {"class": "list-card-top"})
    # brokerage = list(soup.find_all(class_="list-card-brokerage list-card-img-overlay", text=True))
    # link = soup.find_all(class_="list-card-link")

    home_info: List[Dict[str, str]] = []

    list_container = soup.find_all("article", class_="list-card")
    for container in list_container:
        a = container.find("a", attrs={"class": "list-card-link"})
        if a:
            thumbnail_image = container.find("img", attrs={"class": ""})

            if thumbnail_image:
                url = a["href"]
                src = thumbnail_image.get("src", None)
                price = container.find("div", attrs={"class": "list-card-price"})

                home_info.append({"url": a["href"], "imgLink": src, "price": price.contents[0]})

    return parse_zillow_urls(home_info)


def parse_zillow_urls(home_info: List[Dict[str, str]]) -> List[Dict[str, str]]:

    for home in home_info:
        url = home["url"]
        find_address = re.findall(r"homedetails/([\w_-]+)/\d+", url)
        clean_address = re.sub("-", " ", find_address[0])

        home["address"] = clean_address

    return home_info


def selenium_get_site_data(url_to_open: str = ""):
    print(f"Opening site {url_to_open}.")

    driver = Scraper.get_driver()
    home_url = "https://www.zillow.com/homes/08016_rb/"
    driver.get(home_url)
    time.sleep(random.randint(2, 5))
    # print(driver.page_source)

    print("############\n############\n############\n")

    try:
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "photo-cards_wow")))
    except:
        print(driver.page_source)

    homes_list: WebElement = driver.find_element_by_class_name("photo-cards_wow")
    print(homes_list.text)

    home_items: List[WebElement] = homes_list.find_elements_by_tag_name("li")

    all_homes = ""
    for home in home_items:
        all_homes += "\n" + home.text

    with open("site.html", "w", encoding="utf-8") as f:
        # f.write(bs.get_text())
        # f.write(ps)
        f.write(all_homes)

    # Click on the first home
    WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "filter-button_active")))
    button: WebElement = home_items[0]
    url_holder: WebElement = button.find_element_by_class_name("list-card-info")
    url: WebElement = url_holder.find_element_by_tag_name("a")

    next_url = url.get_attribute("href")
    print(f"The URL that was found is located in {next_url}")
    driver.quit()

    driver = Scraper.get_driver()
    # site_url = next_url
    print("Trying to get response")

    site_url = "https://www.zillow.com/homedetails/80-Riverwalk-Blvd-Burlington-NJ-08016/124178792_zpid/"
    driver.get(site_url)
    time.sleep(random.randint(2, 5))
    site_html = driver.page_source
    print(site_html)
    print("############\n############\n############\n")

    price_info: WebElement = driver.find_element_by_class_name("zsg-tooltip-viewport")
    print(price_info.text)
    driver.quit()

    # return send_request()
