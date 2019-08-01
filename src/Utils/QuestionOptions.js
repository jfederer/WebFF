import {
	 ANALYSE_TEXT_SF,
 ANALYSE_TEXT_SA,
 ANALYSE_TEXT_LOI ,
 ANALYSE_TEXT_Z,
 ANALYSE_TEXT_FO,
 ANALYSE_TEXT_BD ,
 ANALYSE_TEXT_C ,
 ANALYSE_TEXT_T ,
 ANALYSE_TEXT_DS,
 ANALYSE_TEXT_SC ,

 TURB_TEXT_LOI,
 TURB_TEXT_SA,
 TURB_TEXT_NTU,

 PCODE_TEXT_NTU,
 PCODE_TEXT_NTRU,
 PCODE_TEXT_FNU,

 SAMPLE_TIME_HEADER,
 SAMPLE_DATE_HEADER,
 M2LAB_HEADER,
 DESCRIPTION_HEADER,
 ADD_ON_HEADER,
 HYDROLOGIC_EVENT_HEADER,
 HYDROLOGIC_COND_HEADER,
 SAMPLE_TYPE_HEADER,
 ASTAT_CODE_HEADER
} from '../Constants/Dictionary';

export const allQWDATAOptionalHeaders = {  //formatted: "DISPLAY HEADER" : "Q_ID"   (null Q_id means this is a special case)
	[DESCRIPTION_HEADER]: null,
	[SAMPLE_DATE_HEADER]: null,
	[SAMPLE_TIME_HEADER]: null,
	[HYDROLOGIC_EVENT_HEADER]: "hydrologicEvent",
	[HYDROLOGIC_COND_HEADER]: "hydrologicCondition",
	[SAMPLE_TYPE_HEADER]: "sampleType",
	[ASTAT_CODE_HEADER]: "analysisStatus",
	[ADD_ON_HEADER]: null,
	[M2LAB_HEADER]: null
}

export const allOpts = {
	[ANALYSE_TEXT_SF]:"SF",
	[ANALYSE_TEXT_SA]:"SA",
	[ANALYSE_TEXT_LOI]:"LOI",
	[ANALYSE_TEXT_Z]:"Z",
    [ANALYSE_TEXT_FO]:"FO",
    [ANALYSE_TEXT_BD]:"BD",
    [ANALYSE_TEXT_C]:"C",
    [ANALYSE_TEXT_T]:"T",
    [ANALYSE_TEXT_DS]:"DS",
    [ANALYSE_TEXT_SC]:"SC"
}

export const allAddOnOpts_bedload = {
	[ANALYSE_TEXT_Z]: "Z"
}

export const allAddOnOpts_bottom = {
	[ANALYSE_TEXT_SF]: "SF",
	[ANALYSE_TEXT_LOI]: "LOI",
	[ANALYSE_TEXT_SA]: "SA",
	[ANALYSE_TEXT_Z]: "Z"
}

export const allAddOnOpts_suspended = {
	[ANALYSE_TEXT_SF]: "SF",
	[ANALYSE_TEXT_SA]: "SA",
	[ANALYSE_TEXT_LOI]: "LOI",
	[ANALYSE_TEXT_Z]: "Z"
}
export const allTubidityOpts = {
	[TURB_TEXT_NTU]: "63675",
	[TURB_TEXT_SA]: "63676",
	[TURB_TEXT_LOI]: "63680"
}



export const pCodes = {
	"Water Temp C": "P00010",
	"Air Temp C": "P00020",
	"Dissolved Oxygen": "P00300",
	"pH": "P00400",
	"Inst Disch": "P00061",
	"Gage Height": "P00065",
	"Specific Cond": "P00095",
	[PCODE_TEXT_NTU]: "P63675",
	[PCODE_TEXT_NTRU]: "P63676",
	[PCODE_TEXT_FNU]: "P63680",
	"Transparency": "P65225",
	"Velocity to compute isokinetic transit rate, feet per second": "P72196"
};

export const nq_options = {
	"nQ": null,
	"a": "a",
	"b": "b",
	"e": "e",
	"f": "f",
	"x": "x"
}

export const nq_options_meanings = {
	"a": "planned measurement was not made",
	"b": "sample broken/spilled in shipment",
	"e": "required equipment not functional or available",
	"f": "sample discarded: improper filter used",
	"x": "result failed quality assurance review"
}

export const rmk_options = {
	"rmk": null,
	"<": "<",
	">": ">",
	"E": "E",
	"M": "M",
	"N": "N",
	"A": "A",
	"V": "V",
	"S": "S",
	"U": "U"
}

export const mth_options = {
	"P00061": ["mth", "G0011", "Q-EST", "QADCP", "QFLUM", "QIDIR", "QSCMM", "QSLPQ", "QSTGQ", "QTRAC", "QUNSP", "QVELO", "QVOLM", "QWEIR", "ZEROF"],
	"P00010": ["mth", "G0004", "THM01", "THM02", "THM03", "THM07"],
	"P00020": ["mth", "G0005", "THM04", "THM05"],
	"P00300": ["mth", "AZIDE", "G0017", "G0018", "IND02", "IND03", "INDGO", "INDKT", "LUMIN", "MEMB2", "MEMBR", "RHODA", "SPC10", "WINKL"],
	"P00400": ["mth", "EL003", "EL009", "PAPER", "PROBE"],
	"P00065": ["mth", "ACOUS", "CLIP", "CSG", "ENCD", "ETG", "FLOAT", "G0012", "HWM", "INSD", "LPRNT", "MANO", "NCAC", "NCLZ", "NCRD", "NTRAN", "OTSD", "RP", "STAF1", "STAFF", "STRAN", "WWG"],
	"P00095": ["mth", "SC001", "SC003"],
	"P63675": ["mth", "TBD03", "TS028", "TS088", "TS089", "TS093", "TS094", "TS095", "TS096", "TS097", "TS099", "TS102", "TS103", "TS104", "TS105", "TS106", "TS108", "TS109", "TS110", "TS111", "TS112", "TS113", "TS114", "TS116", "TS117", "TS118", "TS120", "TS121", "TS122", "TS124", "TS126", "TS127", "TS128", "TS130", "TS131", "TS132", "TS133", "TS134", "TS135", "TS136", "TS137", "TS138", "TS158", "TS159", "TS160", "TS161", "TS162", "TS163", "TS164", "TS165", "TS166", "TS188"],
	"P63676": ["mth", "TS027", "TS090", "TS091", "TS092", "TS098", "TS100", "TS101", "TS107", "TS115", "TS116", "TS117", "TS119", "TS123", "TS125", "TS129", "TS141", "TS167", "TS168", "TS169", "TS192", "TS193", "TS196"],
	"P63680": ["mth", "TS031", "TS032", "TS034", "TS035", "TS036", "TS037", "TS038", "TS040", "TS041", "TS042", "TS043", "TS044", "TS047", "TS048", "TS049", "TS050", "TS053", "TS054", "TS055", "TS056", "TS057", "TS058", "TS059", "TS060", "TS061", "TS062", "TS063", "TS064", "TS065", "TS066", "TS067", "TS068", "TS069", "TS070", "TS071", "TS074", "TS075", "TS076", "TS078", "TS080", "TS081", "TS082", "TS084", "TS085", "TS086", "TS087", "TS145", "TS146", "TS147", "TS148", "TS149", "TS150", "TS151", "TS156", "TS173", "TS174", "TS175", "TS176", "TS177", "TS178", "TS189", "TS198", "TS208", "TS209", "TS213", "TS214", "TS216"],
	"P65225": ["mth", "TTUBE"],
	"P72196": ["mth", "SADVM", "UADVM", "V-EST", "VADCP", "VADV", "VELC", "VICE", "VIPAA", "VIPYG", "VOTT", "VPAA", "VPYG", "VRAD", "VTIME", "VTRNS", "VULT"]
}

export const types = ["_val", "_mth", "_rmk", "_nq"];

export const defaultPCodesToShow = ["P00010", "P00020", "P00061", "P00065", "P00095", "P00300", "P00400"];