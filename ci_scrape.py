import os

with open("ci.txt.2") as infile:
    current_mode = ""
    for line in infile:
        if line.startswith("#"):
            continue
        if "-" in line:
            name, url = line.split(" - ")
            url = "www.wynn".join(url.split("wynn", 1))
            response = os.popen("curl "+url).read()
            for line in response.split("\n"):
                if "itembox macrocategory" in line:
                    response = line
                    break
            with open(f"ci.2/{name}.html", "w") as outfile:
                outfile.write(response)
        if "_" in line:
            break

