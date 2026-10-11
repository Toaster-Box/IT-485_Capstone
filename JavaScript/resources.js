/* script to load resources info based on what is passed in the link 
Reads from a JSON file to create an object that is then parsed into the relevent page content
*/
var page = "../JavaScript/WIC.JSON"
async function loadJSON(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const resourceData = await response.json();
    console.log(resourceData.name);
  }
  catch(err) {console.log(err.message)}
}

loadJSON(page);