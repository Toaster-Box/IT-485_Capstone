import csv
import sys

# Input the whole file name with /CSVfiles as the path, make sure this script is in the same file or subfolder
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
        print(type(content[x]))
        print(content[x])
        x += 1
    print(content)
    f.close()

with open(rFileName[1]+".JSON","w") as rfile:
    