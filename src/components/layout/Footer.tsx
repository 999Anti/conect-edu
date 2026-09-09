'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              CONECT <span className="text-primary-400">EDU</span>
            </h3>
            <p className="text-secondary-400 text-sm">
              Connecting Nigerian parents and guardians with leading private secondary schools.
            </p>
          </div>

          {/* For Parents */}
          <div>
            <h4 className="font-semibold mb-4">For Parents</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li>
                <Link href="/schools" className="hover:text-white transition-colors">
                  Find Schools
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Compare Schools
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Create Parent Account
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* For Schools */}
          <div>
            <h4 className="font-semibold mb-4">For Schools</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li>
                <Link href="/school-apply" className="hover:text-white transition-colors">
                  List Your School
                </Link>
              </li>
              <li>
                <Link href="/school-login" className="hover:text-white transition-colors">
                  School Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-secondary-400">
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Help Centre
                </Link>
              </li>
              <li>
                <Link href="/platform-login" className="hover:text-white transition-colors">
                  Platform Administrator Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-secondary-400">
            <p>
              &copy; {new Date().getFullYear()} CONECT EDU. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="hover:text-white transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
