<?php
// get the q parameter from URL
$q = $_REQUEST["q"];
//temperary save to send data
file_put_contents('test2.xml', $q);

//include ssh librarys (http://phpseclib.sourceforge.net/ssh/intro.html)
include('Net/SSH2.php');
include('Crypt/RSA.php');
include('Net/SCP.php');
include('Net/SFTP.php');

//create connection to url
$ssh = new Net_SSH2('nwqlsun11.cr.usgs.gov');

//create a key variable
$key = new Crypt_RSA();

//get the private key
$key->loadKey(file_get_contents('id_rsa_sedwcnx1_sun11'));

//attempt to login using username and private key
if (!$ssh->login('sedwcnx1', $key)) {
    exit('Login Failed');
}else{
	echo "Login Success: ";
	$output = $ssh->exec('wget -O /usr/opt/apache2/htdocs/htdocs/uo/labxfer/sedwe/incoming/sedwe_xml.jfederer.August22.xml http://152.61.248.16/mnlocal/sandbox/test/kaskachtest.xml');
	
	$output .= $ssh->exec("/usr/opt/apache2/htdocs/htdocs/uo/labxfer/bin/sedwe_import.pl import_SedWE 76 jfederer t3mp0r4ry!46 debug");
	
	//-v -o StrictHostKeyChecking=no \wamp\www\mnlocal\sandbox\test\kaskachtest.xml C:/wamp/www/mnlocal/sandbox/test/kaskachtest.xml
	
	/*$scp = new Net_SCP($ssh);
   if (!$scp->put('sedwcnx1@nwqlsun11:/usr/opt/apache2/htdocs/htdocs/uo/labxfer/sedwe/incoming/kaskachtest3.xml', 'xxxxx'))
    {
        echo "Failed to send file";
    }else{
		echo "check";
	}*/
	
	//$output = $ssh->exec('scp C:/wamp/www/mnlocal/sandbox/test/kaskachtest.xml sedwcnx1@nwqlsun11:/usr/opt/apache2/htdocs/htdocs/uo/labxfer/sedwe/incoming/kaskachtest');
	echo $output;
	
	

}
?>

