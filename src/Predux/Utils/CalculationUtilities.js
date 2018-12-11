
export const provideEWISamplingLocations = (samplingZone_left, samplingZone_right, pierLocations, pierWidths, numberOfSamples) => {
    
    samplingZone_left = parseInt(samplingZone_left, 10);
    samplingZone_right = parseInt(samplingZone_right, 10);
    pierLocations.filter((el)=>parseInt(el, 10));
    pierWidths.filter((el)=>parseInt(el, 10)); 
    numberOfSamples = parseInt(numberOfSamples, 10);
    if(numberOfSamples===null | numberOfSamples==="") {
		return;
	}
   let samplingLocations = new Array(numberOfSamples);
    let pierCounted = new Array(pierLocations.length).fill(false);
    let pierTotalWidth = 0;

   // console.log("CALCULATING");

    // console.log(samplingZone_left, samplingZone_right, pierLocations, pierWidths, numberOfSamples);

    function correctSamplingLocationBasedOnPiers (location) {
        // console.log("location: ", location);
        for(let i =0; i<pierLocations.length; i++) {
            if(location > pierLocations[i] && pierCounted[i]===false) {
                pierCounted[i] = true;
                location+=pierWidths[i];
            }
        }
    // console.log("Corrected location: ", location);
        return location;
    }



    for(let i = 0; i<pierWidths.length; i++) {
        pierTotalWidth += pierWidths[i];
    }
    let samplingZoneWidth = (samplingZone_right - samplingZone_left) - pierTotalWidth;
    let samplingWidth = samplingZoneWidth / numberOfSamples;

    samplingLocations[0] = correctSamplingLocationBasedOnPiers(samplingZone_left+(samplingWidth/2));
    for(let i = 1; i<samplingLocations.length;i++) {
        samplingLocations[i] = correctSamplingLocationBasedOnPiers(samplingLocations[i-1]+samplingWidth);
    }
    for(let i = 0; i<samplingLocations.length;i++) {
        samplingLocations[i] = Math.round( samplingLocations[i] * 10 ) / 10;
    }



    
   
    // for(let i = 0; i<pierLocations.length; i++) {
    //     console.log("pier located from " + pierLocations[i] + "-" + (pierLocations[i]+pierWidths[i]));
    // }
    // console.log("samplingZoneWidth: ", samplingZoneWidth)
    // console.log("samplingWidth: ", samplingWidth)
    // console.log(provideEWISamplingLocations(20, 500, 
    //     [30, 180, 210, 410], 
    //     [120,20,12,45],
    //     5));



return samplingLocations;
    

}

export const provideEDISamplingPercentages = (numberOfSamples) => {
  let width = 100 / numberOfSamples;
  let results = [];
  for(let i=1; i<=numberOfSamples; i++) {
	results.push((Math.round((((i)*width)-(width/2))* 10 ) / 10)+'%');
  }
return results;
}