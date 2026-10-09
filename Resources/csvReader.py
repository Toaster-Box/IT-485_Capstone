import csv
import sys

# Input the whole file name with /CSVfiles as the path, make sure this script is in where you want the JSON file created
file = sys.argv[1]
temp = file.split(".")
rFileName = temp[0].split("/")

with open(file,"r") as f:
    line = csv.reader(f)
    next(line)
    content = next(line)
    x = 0
    for str in content:
        content[x] = str.replace("[","").replace("]","").strip()
        x += 1
    f.close()

with open(rFileName[1]+".JSON","w") as rfile:
    rfile.write("{\n")
    rfile.write("\t\"category\":\""               + content[0] + "\",\n")
    rfile.write("\t\"org\":\""                    + content[1] + "\",\n")
    rfile.write("\t\"description\":\""            + content[2] + "\",\n")
    rfile.write("\t\"whatThisIs\":\""             + content[3] + "\",\n")
    rfile.write("\t\"link\":\""                   + content[4] + "\",\n")
    rfile.write("\t\"relatedLink\":\""            + content[5] + "\",\n")
    rfile.write("\t\"relatedLinkExplanation\":\"" + content[6] + "\",\n")
    rfile.write("\t\"application\":\""            + content[7] + "\",\n")
    rfile.write("\t\"whoItHelps\":\""             + content[8] + "\",\n")
    rfile.write("\t\"whatItHelps\":\""            + content[9] + "\",\n")
    rfile.write("\t\"whatToKnow\":\""             + content[10] + "\",\n")
    rfile.write("\t\"lastUpdated\":\""            + content[11] + "\",\n")
    rfile.write("\t\"name\":\""                   + content[12] + "\"\n")
    rfile.write("}")
    rfile.close()
print("Converted info to JSON file!")