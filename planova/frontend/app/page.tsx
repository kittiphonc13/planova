import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">Planova</h1>
          </div>
          <nav className="hidden space-x-8 md:flex">
            <Link href="/features" className="text-sm font-medium text-gray-700 hover:text-primary-600">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-700 hover:text-primary-600">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary-600">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600">
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 items-center bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Your Personal</span>
                <span className="block text-primary-600">Nutrition & Fitness</span>
                <span className="block">Companion</span>
              </h1>
              <p className="max-w-md text-lg text-gray-500">
                Achieve your fitness goals with personalized nutrition plans and workout routines tailored to your unique needs.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/register" className="btn btn-primary px-8 py-3 text-base">
                  Get Started
                </Link>
                <Link href="/features" className="btn btn-outline px-8 py-3 text-base">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-[400px] overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-5xl font-bold text-primary-600">Planova</div>
                    <p className="text-lg font-medium text-gray-700">Nutrition & Weight Training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need to achieve your fitness goals</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="card">
              <div className="mb-4 rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Personalized Nutrition Plans</h3>
              <p className="text-gray-500">
                Get customized meal plans based on your body metrics, goals, and dietary preferences.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="card">
              <div className="mb-4 rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Tailored Workout Routines</h3>
              <p className="text-gray-500">
                Follow workout plans designed for your fitness level, goals, and available equipment.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="card">
              <div className="mb-4 rounded-full bg-primary-100 p-3 w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Progress Tracking</h3>
              <p className="text-gray-500">
                Monitor your progress with detailed analytics and visualizations of your fitness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to transform your fitness journey?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Join thousands of users who have already achieved their fitness goals with Planova.
          </p>
          <div className="mt-8">
            <Link href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-base">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-900">Planova</h3>
              <p className="text-gray-500">Your personal nutrition and weight training companion.</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-900">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-gray-500 hover:text-primary-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-500 hover:text-primary-600">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-900">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-500 hover:text-primary-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:text-primary-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-900">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-primary-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-primary-600">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} Planova. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
