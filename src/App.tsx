import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import PublicLayout from "@/layout/PublicLayout"
import HomePage from "@/components/HomePage"
import AuthLayout from "@/layout/AuthLayout"
import SignIn from "@/components/SignInPage"
import SignUp from "@/components/SignUpPage"
import ProtectedRoute from "@/layout/ProtectedRoute"
import MainLayout from "@/layout/MainLayout"
import { Generate } from "./components/Generate"
// import Dashboard from "./components/Routes/Dashboard"
// import CreateEditPage from "./components/Routes/CreateEditPage"
// import MockLoadPage from "./components/Routes/MockLoadPage"
// import MockInterviewPage from "./components/Routes/MockInterviewPage"
// import FeedbackPage from "./components/Routes/FeedbackPage"
import ContactPage from "./pages/ContactPage"
import AboutUsPage from "./pages/AboutUsPage"
import GenerateCourse from "./pages/generate/GenerateCourse"
import CourseDashboard from "./components/dashboard/CourseDashboard"
import CreateCourse from "./pages/generate/CreateCourse"
// import ContentViewer from "./viewers/ContentViewer"
// import EditPage from "./pages/EditPage"
import ViewContent from "./pages/ViewContent"
import EditCourse from "./pages/EditCourse"
// import GenerateCourse from "./pages/GenerateCourse"


const App = () => {
  return (
    <Router>
      <Routes>
        {/* public routes  */}
        <Route element={<PublicLayout/>}>
        <Route index element={<HomePage/>}></Route>
        <Route path="contact" element={<ContactPage/>}/>
        <Route  path="about" element={<AboutUsPage/>}/>
        </Route>
        {/* Authenticated routes */}
        <Route element={<AuthLayout/>}>
        <Route path="/signin/*" element={<SignIn/>}/>
        <Route path="/signup/*" element={<SignUp/>}/>
        </Route>

        {/* protected layout */}
        <Route element={<ProtectedRoute><MainLayout/></ProtectedRoute>}>
         {/* here we have to add the protected routes */}
         <Route  path="/generate" element={<Generate/>}>
         {/* <Route index element={<Dashboard/>}/> */}
         <Route index element={<CourseDashboard/>}/>
         {/* <Route path=":Id" element={<CreateEditPage/>}/> */}
         {/* <Route path="user/:Id" element={<MockLoadPage/>}/> */}
          

         {/* <Route path="user/:Id/start" element={<MockInterviewPage/>}/> */}
         {/* <Route path="user/:Id" element={<FeedbackPage/>}/> */}
         <Route path="/generate/course" element={<GenerateCourse/>}/>
         <Route path="/generate/course/create" element={<CreateCourse/>}/>
         {/* <Route path="/generate/content/view/:id" element={<ContentViewer/>}/> */}
              <Route path="/generate/content/view/:id" element={<ViewContent />} />
              <Route path="/generate/content/edit/:id" element={<EditCourse />} />

        
         

         </Route>
        </Route>
        
      </Routes>
    </Router>
  )
}

export default App