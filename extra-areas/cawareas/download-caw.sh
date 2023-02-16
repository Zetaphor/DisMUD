#!/bin/bash

# specify the URL of the webpage to parse
URL="https://www.circlemud.org/pub/furry/areas/Caw/"

# use curl to retrieve the webpage and extract all links
LINKS=$(curl -s $URL | grep -oE "href=\"[^\"]+\.(README|zip|gz|Errata|specials)\"" | cut -d'"' -f2)

# loop through the links and download each one using wget
for LINK in $LINKS
do
    wget $URL/$LINK
done
