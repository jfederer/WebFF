<?php
// get the q parameter from URL
$q = $_REQUEST["q"];

$out = "";

if ($q !== "") {
    $out = $q;
    $a = explode (",",$q);
}

//echo $q;


//Creates XML string and XML document using the DOM 
$dom = new DomDocument('1.0', 'UTF-8'); 

//add root
$root = $dom->appendChild($dom->createElement('Root'));

//add NodeA element to Root
$nodeA = $dom->createElement('FieldData');
$root->appendChild($nodeA);

// Appending attr1 and attr2 to the NodeA element
$attr = $dom->createAttribute('attr1');
$attr->appendChild($dom->createTextNode($a[0]));
$nodeA->appendChild($attr);
$attr = $dom->createAttribute('attr2');
$attr->appendChild($dom->createTextNode($a[1]));
$nodeA->appendChild($attr);
$attr = $dom->createAttribute('attr3');
$attr->appendChild($dom->createTextNode($a[2]));
$nodeA->appendChild($attr);
/*
** insert more nodes
*/

$dom->formatOutput = true; // set the formatOutput attribute of domDocument to true

// save XML as string or file 
$test1 = $dom->saveXML(); // put string in test1
$dom->save('test1.xml'); // save as file

$xmlfile = file_get_contents('test1.xml');
file_put_contents('test2.xml', $xmlfile);

include('Net/SSH2.php');
include('Crypt/RSA.php');

$ssh = new Net_SSH2('nwqlsun11.cr.usgs.gov');
$key = new Crypt_RSA();
$key->loadKey(file_get_contents('id_rsa_sedwcnx1_sun11'));
if (!$ssh->login('sedwcnx1', $key)) {
    exit('Login Failed');
}else{
	echo "Login Success: ";
	$ssh->exec('ls -la');
	//$ssh->write('scp kaskachtest.xml sedwcnx1@nwqlsun11:/usr/opt/apache2/htdocs/htdocs/uo/labxfer/sedwe/incoming/sedwe_xml.kaskach.test_file_2017_09_14\n');
	echo $ssh->read('sedwcnx1@sedwcnx11:~$');
}

//ken_was_here

//$ssh->write("scp kaskachtest.xml sedwcnx1@nwqlsun11:/usr/opt/apache2/htdocs/htdocs/uo/labxfer/sedwe/incoming/sedwe_xml.kaskach.test_file_2017_09_14\n"); // note the "\n"
//echo $ssh->read('sedwcnx1@sedwcnx11:~$');
unset($ssh);
?>

