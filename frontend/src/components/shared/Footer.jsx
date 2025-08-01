import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-gray-700 py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-center md:text-left">
        <div>
          <h2 className="font-bold text-white text-base">
            <span className="text-purple-500">Job</span>Fusion
          </h2>
          <p className="text-gray-400 text-xs leading-tight">
            Track applications. Stay organized. Land faster.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-center md:ml-auto md:mr-auto md:translate-x-[-40%] space-x-3">
          {[FaGithub, FaLinkedinIn, FaFacebookF, FaTwitter, FaInstagram].map(
            (Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-full bg-gray-600/70 hover:bg-purple-600 transition"
              >
                <Icon size={14} className="text-gray-300 hover:text-white" />
              </a>
            )
          )}
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} JobFusion
        </div>
      </div>
    </footer>
  );
}
