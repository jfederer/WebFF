
export const provideEWISamplingLocations = (samplingZone_left, samplingZone_right, pierLocations, pierWidths, numberOfSamples) => {
    let samplingLocations = new Array(numberOfSamples);
    let pierCounted = new Array(pierLocations.length).fill(false);
    let pierTotalWidth = 0;
    console.log("CALCULATING");

    function correctSamplingLocationBasedOnPiers (location) {
        console.log("location: ", location);
        for(let i =0; i<pierLocations.length; i++) {
            if(location > pierLocations[i] && pierCounted[i]===false) {
                pierCounted[i] = true;
                location+=pierWidths[i];
            }
        }
        console.log("Corrected location: ", location);
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

    
    //TODO: Erin needs to verify output
    for(let i = 0; i<pierLocations.length; i++) {
        console.log("pier located from " + pierLocations[i] + "-" + (pierLocations[i]+pierWidths[i]));
    }
    console.log("samplingZoneWidth: ", samplingZoneWidth)
    console.log("samplingWidth: ", samplingWidth)
    // console.log(provideEWISamplingLocations(20, 500, 
    //     [30, 180, 210, 410], 
    //     [120,20,12,45],
    //     5));



return samplingLocations;
    

}