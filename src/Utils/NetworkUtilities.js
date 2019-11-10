export const hostReachable = (hostname) => {

    // Handle IE and more capable browsers
    var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
    var status;
  
    // Open new request as a HEAD to the root hostname with a random param to bust the cache
    xhr.open( "HEAD", "//" + hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );
    // xhr.open( "HEAD", "//" + window.location.hostname + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );
  
    // Issue request and handle response
    try {
      xhr.send();
      return ( xhr.status >= 200 && (xhr.status < 300 || xhr.status === 304) );
    } catch (error) {
      return false;
    }
  
  }
 
  export const fetchDBInfo = (needle, collection, successCB, failureCB) => {
		const DEBUG = false;
		if (DEBUG) console.log("fetchDBInfo(", needle, collection, ")");

		// sort out differences in local dev server and production server calls
		// const API = PHP_FILE_LOCATION + 'dbFetch.php/';
				// if (isDEV) //TODO:
				//TODO: pull from constants  FIXME: 
		const API = "http://sedff.usgs.gov/php/" + 'dbFetch2.php?';
		let query = '';

		if (!needle) {
			console.warn("Needle not passed to fetchDBInfo");
			return;
		}
		if (!collection) {
			console.warn("ERR: collection required for DB fetch");
			return;
		}

		query += "needleKey=" + encodeURIComponent(needle.key)
		query += "&needleValue=" + encodeURIComponent(needle.value);
		query += "&collection=" + collection;

		function handleErrors(response) {
			// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			if (!response.ok) {
				throw Error(response.statusText);
			}
			//note 404 is not found and 400 is a mal-formed request
			return response;
		}

		if (DEBUG) console.log("Function: fetchDBInfo @ " + API + query);
		fetch(API, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
			}),
			body: query
		})
			.then(handleErrors)
			.then(response =>
				response.json()
				//  response.text()
			)
			.then(parsedJSON => {
				if (DEBUG) console.log("Parsed JSON: ", parsedJSON);
				// setTimeout(() => {
				// console.log('parsedJSON', parsedJSON)
				successCB(parsedJSON);
				// }, 1200);
			})
			// .catch(error => {  });
			.catch(error => {
				if (typeof failureCB === "function") {
					failureCB(error);
				}
				else {
					console.error("Error fetching " + API + query + "\n" + error);
				}
			});
  }
  
  export const setDBInfo = (needle, collection, newData, successCB, failureCB) => {
		// attempts to update location
		// returns the ENTIRE newly updated data element to the successCB
		// return any errors to failureCB

		const API = "http://sedff.usgs.gov/php/" + 'dbPatch2.php?';

		const DEBUG = true;
		if (!needle) {
			console.warn("Needle reuired and not passed to setDBInfo");
			return;
		}
		if (!collection) {
			console.warn("Collection required and not passed to setDBInfo");
			return;
		}
		if (!newData) { //TODO: this should make sure it wasn't just passed 'false'
			console.warn("NewData required and not passed to setDBInfo")
		}

		let query = "needleKey=" + encodeURIComponent(needle.key)
		query += "&needleValue=" + encodeURIComponent(needle.value);
		query += "&collection=" + encodeURIComponent(collection);
		query += "&newData=" + encodeURIComponent(JSON.stringify(newData));

		function handleErrors(response) {
			// fetch only throws an error if there is a networking or permission problem (often due to offline).  A "ok" response indicates we actually got the info
			if (!response.ok) {
				console.warn("DB response was not okay");
				throw Error(response.statusText);
			}
			//note 404 is not found and 400 is a mal-formed request
			return response;
		}

		if (DEBUG) console.log("Function: fetchDBInfo PATCH @ " + API + query);

		fetch(API, {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
			}),
			body: query
		})
			.then(handleErrors)
			.then(response => {
				return response.text()
			}
				
			)
			.then(parsedJSON => {
				if (DEBUG) console.log("Parsed JSON: ", parsedJSON);
				// setTimeout(() => {
				// console.log('parsedJSON', parsedJSON)
				successCB(parsedJSON);
				// }, 1200);
			})
			.catch(error => {
				console.log('error', error)
				if (typeof failureCB === "function") {
					failureCB(error);
				}
				else {
					console.error("Error fetching " + API + query + "\n" + error);
				}
			});
	}