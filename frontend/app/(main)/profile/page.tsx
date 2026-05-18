const ProfilePage = () => {
  return (
    <div className="w-full max-w-3xl p-6">
      <div className="border border-neutral-200 rounded-lg p-6 bg-white">
        <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-neutral-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-neutral-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Learning Style */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred Learning Style
            </label>

            <select className="w-full border border-neutral-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
              <option>Visual</option>
              <option>Hands-on</option>
              <option>Reading</option>
              <option>Step-by-step</option>
            </select>
          </div>

          {/* AI Tone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              AI Response Style
            </label>

            <select className="w-full border border-neutral-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
              <option>Professional</option>
              <option>Friendly</option>
              <option>Detailed</option>
              <option>Concise</option>
            </select>
          </div>

          {/* Save Button */}
          <button className="bg-black text-white px-5 py-3 rounded-md hover:bg-neutral-800 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;