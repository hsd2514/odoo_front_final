import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Home />
      </main>
    </div>
  );
}

function Home() {
  const features = [
    {
      title: "Dashboard",
      description: "Get an overview of your business performance"
    },
    {
      title: "Products",
      description: "Manage your product inventory"
    },
    {
      title: "Orders",
      description: "Track and manage customer orders"
    },
    {
      title: "Reports",
      description: "Access detailed business analytics"
    },
    {
      title: "Settings",
      description: "Configure your application preferences"
    }
  ];

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to RentKar</h1>
        <p className="text-xl text-gray-600">Your complete Rent management solution</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
