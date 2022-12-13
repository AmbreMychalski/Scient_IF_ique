function rechercherScientist(scientistName){
  var requete = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>
        PREFIX : <http://dbpedia.org/resource/>
        PREFIX dbpedia2: <http://dbpedia.org/property/>
        PREFIX dbpedia: <http://dbpedia.org/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        \n
        SELECT GROUP_CONCAT(?discipline;separator =";") AS ?disciplines ?name ?description ?conjoint ?isPrimaryTopicOf ?thumbnail WHERE {
            :${scientistName} dbo:academicDiscipline ?discipline.
            :${scientistName} foaf:name ?name.
            OPTIONAL{:${scientistName} dbo:birthDate ?date}
            OPTIONAL{:${scientistName} dbo:abstract ?description}
            OPTIONAL{:${scientistName} dbo:spouse ?conjoint}
            OPTIONAL{:${scientistName} foaf:isPrimaryTopicOf ?isPrimaryTopicOf}
            OPTIONAL{:${scientistName} dbo:thumbnail ?thumbnail}
            FILTER(langMatches(lang(?description),"EN"))
        }`;
  
      
    // Encodage de l'URL à transmettre à DBPedia
    var url_base = "http://dbpedia.org/sparql/";
    $(document).ready(function(){
        $.ajax({
            //L'URL de la requête 
            url: url_base,
  
            //La méthode d'envoi (type de requête)
            method: "GET",
  
            //Le format de réponse attendu
            dataType : "json",
            data : {query : requete}
        })
        //Ce code sera exécuté en cas de succès - La réponse du serveur est passée à done()
        /*On peut par exemple convertir cette réponse en chaine JSON et insérer
        * cette chaine dans un div id="res"*/
        .done(function(response){
            console.log(response);
            afficherScientist(response);
            
        })
  
        //Ce code sera exécuté en cas d'échec - L'erreur est passée à fail()
        //On peut afficher les informations relatives à la requête et à l'erreur
        .fail(function(error){
          resultats = null;
            alert("La requête s'est terminée en échec. Infos : " + JSON.stringify(error));
        })
        //Ce code sera exécuté que la requête soit un succès ou un échec
        .always(function(){
            //alert("Requête effectuée");
        });
    });
  }


  // Affichage des résultats dans un tableau
function afficherScientist(response)
{
    var titre = document.querySelector('#titre');
    var nomPage = document.querySelector("#nomPage");
    var element = response.results.bindings[0].name.value;
    titre.innerHTML = nomPage.innerHTML = element;
    var lien = document.querySelector('#pageWikipedia');
    lien.setAttribute("href", response.results.bindings[0].isPrimaryTopicOf.value);
    var resume = document.querySelector('#resume');
    element = response.results.bindings[0].description.value;
    resume.innerHTML = element;
    var image = document.querySelector('#image');
    image.setAttribute("src", response.results.bindings[0].thumbnail.value);
    var data = response.results.bindings[0].disciplines.value.split(';');
    // Récupérez l'élément <tbody>
    const tbody = document.querySelector('#disciplines tbody');
    // Insérez les données dans le tableau
    for (const row of data) {
        const tr = document.createElement('tr');

        const td = document.createElement('td');
        const a = document.createElement("a");
        a.href = "domaine.html?domain_name="+row.replace('http://dbpedia.org/resource/', '').replace('_', ' ');
        a.innerHTML = row.replace('http://dbpedia.org/resource/', '').replace('_', ' ');;
        td.appendChild(a);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}