import React, { useState, useContext } from 'react';
import Footer from '../components/Footer';
import { UserContext } from '../components/UserContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const { signup_user } = useContext(UserContext);

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [is_admin, setIsAdmin] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    // Basic form validation
    if (password !== passwordRepeat) {
      toast.error("Passwords do not match");
      return;
    }

    // Call signup_user function from context or dispatch an action
    signup_user(username, email, password, is_admin);

    // Reset form fields
    setUserName('');
    setEmail('');
    setPassword('');
    setPasswordRepeat('');
    setIsAdmin(false);
  }

  return (
    <div>
      {/* <h1 className="text-3xl font-bold underline">Sign Up</h1> */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h4 className='font-bold tex-2xl text-center'>Register new Account</h4>

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">username</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your name"
                    required
                    value={username || ""}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@gmail.com"
                    required
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="passwordRepeat" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat Password</label>
                  <input
                    type="password"
                    name="passwordRepeat"
                    id="passwordRepeat"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={passwordRepeat || ""}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                  />
                </div>
                <div className="flex items-start mb-5">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Register as</label>
                {/* <p>if student, do not check the box</p> */}
                  <div className="flex items-center p-2 h-5"><br />
                  <input
                    id="is_admin"
                    type="checkbox"
                    checked={is_admin }
                    className="checkbox"
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  </div>
                  <label htmlFor="is_admin" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Librarian</label>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default SignUp;
