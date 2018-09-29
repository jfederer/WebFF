export const PHP_FILE_LOCATION = "https://152.61.248.218/php/";
// export const PHP_FILE_LOCATION = "https://sedff.usgs.gov/php/";

export const PROGRAM_VERSION = '0.9.4';

export const SEDLOGIN_SUCCESS_MESSAGE = "Imported 1 event into SedLOGIN project";

export const USER_DB_NODES = ['stations', 'customQuestions'];   //TODO: create a 'settings' node with things like 'usePaper' and 'syncDelay'.  In the future, include other settings like "availableSamplers"

export const SAMPLING_EVENT_IDENTIFIER = "SamplingEvent::";

export const QUESTION_ID_STRINGS_THAT_FORCE_PROPAGATION = ["numberOfSamplingPoints", "samplesComposited", "pier", "edgeOfSamplingZone"];  //TODO: need to ensure no custom questions include these 

export const MAX_NUM_OF_SETS = 3;

export const QIDS_LINKED_TO_STATION_NAME = ["stationNumber", "projectName", "projectID", "agencyCode"];