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
    console.log(resourceData.category);
    
    // Loading the Text
    
    //Left side of screen
    document.getElementById("ResourceCategory").innerText = resourceData.category;
    document.getElementById("ResouceName").innerText = resourceData.name;
    document.getElementById("ProgramDesc").innerText = resourceData.description;
    document.getElementById("UseCase").innerText = resourceData.whoItHelps;
    document.getElementById("ResourceHelpInfo").innerText = resourceData.whatItHelps;
    document.getElementById("ResourceImportInfo").innerText = resourceData.whatToKnow;
    
    // Related information
    document.getElementById("ResourceRelatedExplanation1").innerText = resourceData.relatedLinkExplanation[0];
    document.getElementById("ResourceRelatedLink1").href = resourceData.relatedLink[0];
    document.getElementById("ResourceRelatedExplanation2").innerText = resourceData.relatedLinkExplanation[1];
    document.getElementById("ResourceRelatedLink2").href = resourceData.relatedLink[1];
    document.getElementById("ResourceRelatedExplanation3").innerText = resourceData.relatedLinkExplanation[2];
    document.getElementById("ResourceRelatedLink3").href = resourceData.relatedLink[2];
    document.getElementById("ResourceRelatedExplanation4").innerText = resourceData.relatedLinkExplanation[3];
    document.getElementById("ResourceRelatedLink4").href = resourceData.relatedLink[3];
    document.getElementById("ResourceRelatedExplanation5").innerText = resourceData.relatedLinkExplanation[4];
    document.getElementById("ResourceRelatedLink5").href = resourceData.relatedLink[4];

    
  }
  catch(err) {console.log(err.message)}
}

loadJSON(page);


