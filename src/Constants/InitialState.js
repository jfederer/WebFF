Store = [
	{UI : [
		visibility : {
			menus :
			tabs :
			dialogs :
				sub stuff -- buttons, questions, etc		
		},
		menuContents : {
			navigation : {

			}
			system : {

			}
		},
	]}
	user: {
		username :
		sedloginusername :
		settings : {
			backupInterval :
			usePaper : 
			customQuestions : 
				AssignedTo : [All / List ] (all when null)
				Label
				Location : {
					TabName:
					PanelName:
				}
				Default Value
				Size
				Type
				...addntl
		},
		EventsList : [ ABC, DEF, XYZ ...] 
		StationList : [Here, There, etc]
		Site_XYZ : { (move sites to own node?)
			Name
			Number
			ProjName
			ProjID
			AgncyCode
		}
	}
	events: [
		Event_XYZ :  
			usernames: []
			lastModified:
			status:
			questionvalues:
	]
]
