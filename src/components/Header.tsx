import { useAuth } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";

import Container from "./Container";
import { cn } from "@/lib/utils";
import LogoContainer from "./LogoContainer";
import ProfileContainer from "./ProfileContainer";
import ToggleContainer from "./ToggleContainer";

const Header = () => {
  const { userId } = useAuth();

  return (
    <header className="w-full py-4">
      <Container>
        {/* MAIN NAVBAR WRAPPER */}
        <div className="w-full bg-black text-white rounded-full px-8 py-3 shadow-lg flex items-center justify-between">

          {/* LEFT SIDE: LOGO + BRAND */}
          <div className="flex items-center gap-3">
            <LogoContainer />
            <NavLink
              to="/"
              className="text-xl font-semibold hover:text-yellow-400 transition"
            >
              GenCourse
            </NavLink>
          </div>

          {/* CENTER NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1 rounded-full transition-all",
                  isActive
                    ? "bg-yellow-400 text-black font-semibold"
                    : "hover:text-yellow-400"
                )
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1 rounded-full transition-all",
                  isActive
                    ? "bg-yellow-400 text-black font-semibold"
                    : "hover:text-yellow-400"
                )
              }
            >
              About Us
            </NavLink>

          

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                cn(
                  "px-3 py-1 rounded-full transition-all",
                  isActive
                    ? "bg-yellow-400 text-black font-semibold"
                    : "hover:text-yellow-400"
                )
              }
            >
              Contact
            </NavLink>

            {/* Generate Course - Only If Logged In */}
            {userId && (
              <NavLink
                to="/generate/course"
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-full font-semibold transition",
                    isActive
                      ? "bg-yellow-400 text-black ring-2 ring-yellow-200"
                      : "hover:text-yellow-400"
                  )
                }
              >
                Generate Course
              </NavLink>
            )}
          </nav>

          {/* RIGHT SIDE: PROFILE + THEME TOGGLE */}
          <div className="flex items-center gap-5">

            <ToggleContainer />

            {/* Larger Profile Avatar */}
        <div className="scale-1200 size-80px">
  <ProfileContainer />
</div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
