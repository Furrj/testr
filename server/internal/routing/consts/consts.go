package consts

const (
	CtxKeyUserid                          string = "user_id"
	BearerTokenPrefix                     string = "Bearer "
	HeaderTypeAuthorization               string = "Authorization"
	RouteUrlBase                          string = "/api"
	RouteUrlLogin                         string = RouteUrlBase + "/login"
	RouteUrlSubmitGameSession             string = RouteUrlBase + "/gamesession"
	RouteUrlGetUserData                   string = RouteUrlBase + "/user/get"
	RouteUrlGetGameSessions               string = RouteUrlBase + "/user/get/gamesessions"
	RouteUrlGetStudents                   string = RouteUrlBase + "/getStudents"
	RouteUrlGetUserInfo                   string = RouteUrlBase + "/getUserInfo/:id"
	RouteUrlUpdateVertical                string = RouteUrlBase + "/updateVertical"
	RouteUrlAddClass                      string = RouteUrlBase + "/classes"
	RouteUrlGetClasses                    string = RouteUrlBase + "/classes/get"
	RouteUrlRegisterTeacher               string = RouteUrlBase + "/register/teacher"
	RouteUrlRegisterStudent               string = RouteUrlBase + "/register/student"
	RouteUrlCheckUsername                 string = RouteUrlBase + "/register/checkUsername/:username"
	RouteUrlGetTeacherInfoForRegisterPage string = RouteUrlBase + "/teacher/get/:id"
	RouteUrlGetTeacherData                string = RouteUrlBase + "/teacher/get"
	RouteUrlGetClass                      string = RouteUrlBase + "/class/:id"
	RouteUrlGetStudentData                string = RouteUrlBase + "/teacher/student/get/:id"
	RouteUrlUpdateStudentClass            string = RouteUrlBase + "/updateStudent/class"
	RouteUrlAddAssignment                 string = RouteUrlBase + "/assignments/add"
	RouteUrlGetAssignmentsTeacher         string = RouteUrlBase + "/assignments/get/teacher"
	RouteUrlStudent                       string = RouteUrlBase + "/teacher/student/:id"
	RouteUrlGetPasswordResetCode          string = RouteUrlBase + "/password/reset/:id"
	RouteUrlCheckPasswordResetCode        string = RouteUrlBase + "/password/check"
	RouteUrlUpdatePassword                string = RouteUrlBase + "/password/update"
)
