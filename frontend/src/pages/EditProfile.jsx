import Profile from "../assets/avtar.avif";
import coverImage from "../assets/coverImage.jpeg";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../services/api/profileApi";

import imageCompression from "browser-image-compression";

// localStorage ke "user" object ko naye data se sync rakho
const syncLocalUser = (patch) => {
  try {
    const raw = localStorage.getItem("user");

    if (raw) {
      const user = JSON.parse(raw);
      localStorage.setItem("user", JSON.stringify({ ...user, ...patch }));
    }
  } catch {
    // ignore
  }

  // Navbar ko batao ki profile (photo/naam) badli hai, taaki wo dobara load kare
  window.dispatchEvent(new Event("profile-updated"));
};

const EditProfile = () => {
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");

  // Image states
  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch existing profile and saved image URLs
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        if (!isMounted) return;

        setFullName(data?.name || "");
        setEmail(data?.email || "");
        setCourse(data?.course || "");
        setUniversity(data?.university || "");
        setBio(data?.bio || "");
        setPhone(data?.phone || "");
        setYear(data?.year || "");
        setProfilePreview(data?.profilePic || "");
        setCoverPreview(data?.coverImage || "");
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load profile"
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Select and preview an image before uploading
  const handleImageSelect = async (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      event.target.value = "";
      return;
    }

    try {
      let processedFile = file;

      // Compress only if the image exceeds 5 MB
      if (file.size > 5 * 1024 * 1024) {
        toast.info("Compressing image, please wait...");

        const compressed = await imageCompression(file, {
          maxSizeMB: 4.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        });

        // Compressed result ko hamesha proper File banao (naam + type ke saath)
        processedFile = new File([compressed], file.name, {
          type: compressed.type || file.type,
        });
      }

      // Verify the size after compression
      if (processedFile.size > 5 * 1024 * 1024) {
        toast.error(
          "Image is still larger than 5 MB. Please choose another image."
        );
        event.target.value = "";
        return;
      }

      const previewUrl = URL.createObjectURL(processedFile);

      if (type === "profile") {
        setProfileFile(processedFile);
        setProfilePreview(previewUrl);
      } else if (type === "cover") {
        setCoverFile(processedFile);
        setCoverPreview(previewUrl);
      }

      if (processedFile.size < file.size) {
        toast.success("Image is ready to upload!");
      }
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("Could not compress image. Please try another image.");
      event.target.value = "";
    }
  };

  // Core upload: Cloudinary + DB me save, state update, URL return
  const performImageUpload = async (file, type) => {
    const result = await uploadProfileImage(file, type);
    const imageUrl = result?.data?.imageUrl || result?.imageUrl;

    if (!imageUrl) {
      throw new Error(
        "Upload completed but the image URL was not returned by the server"
      );
    }

    // Replace temporary local preview with permanent Cloudinary URL
    if (type === "profile") {
      setProfilePreview(imageUrl);
      setProfileFile(null);
      syncLocalUser({ profilePic: imageUrl });
    } else {
      setCoverPreview(imageUrl);
      setCoverFile(null);
      syncLocalUser({ coverImage: imageUrl });
    }

    return imageUrl;
  };

  // Upload button handler
  const handleImageUpload = async (file, type) => {
    if (!file) {
      toast.error(
        type === "profile"
          ? "Please select a profile photo first"
          : "Please select a cover image first"
      );
      return;
    }

    const setUploading =
      type === "profile" ? setIsUploadingProfile : setIsUploadingCover;

    try {
      setUploading(true);

      await performImageUpload(file, type);

      toast.success(
        type === "profile"
          ? "Profile photo updated!"
          : "Cover image updated!"
      );
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // Save text profile information
  const handleSaveChanges = async (event) => {
    event?.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (fullName.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(fullName.trim())) {
      toast.error("Name can contain only letters and spaces");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!course.trim()) {
      toast.error("Please enter your course");
      return;
    }

    if (course.trim().length < 3) {
      toast.error("Course must be at least 3 characters");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^\+91\s?\d{10}$/.test(phone.trim())) {
      toast.error(
        "Please enter a valid Indian phone number, e.g. +91 9876543210"
      );
      return;
    }

    if (!university.trim()) {
      toast.error("Please enter your university");
      return;
    }

    if (university.trim().length < 3) {
      toast.error("University name must be at least 3 characters");
      return;
    }

    if (!year.trim()) {
      toast.error("Please enter your year");
      return;
    }

    if (year.trim().length < 2) {
      toast.error("Please enter a valid year");
      return;
    }

    if (!bio.trim()) {
      toast.error("Please enter your bio");
      return;
    }

    if (bio.trim().length < 10) {
      toast.error("Bio must be at least 10 characters");
      return;
    }

    if (bio.trim().length > 300) {
      toast.error("Bio must not exceed 300 characters");
      return;
    }

    try {
      setIsSaving(true);

      // Agar image select ki hai par "Upload" button nahi dabaya,
      // to Save ke time automatically upload kar do.
      if (profileFile) {
        await performImageUpload(profileFile, "profile");
      }

      if (coverFile) {
        await performImageUpload(coverFile, "cover");
      }

      await updateProfile({
        name: fullName.trim(),
        email: email.trim(),
        course: course.trim(),
        university: university.trim(),
        phone: phone.trim(),
        year: year.trim(),
        bio: bio.trim(),
      });

      syncLocalUser({ name: fullName.trim(), email: email.trim() });

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelButton = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-xl shadow-sm">
        {/* Header / Cover image */}
        <div
          className="py-8 px-6 rounded-t-xl bg-cover bg-center"
          style={{
            backgroundImage: `url(${coverPreview || coverImage})`,
          }}
        >
          <div className="rounded-lg bg-white/75 p-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Edit Profile
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              Update your personal information and keep your
              profile up to date
            </p>

            <div className="mt-4 space-y-2">
              <label
                htmlFor="coverImageInput"
                className="inline-block cursor-pointer bg-white text-orange-600 px-4 py-2 rounded-md font-medium"
              >
                Choose Cover Image
              </label>

              <input
                id="coverImageInput"
                type="file"
                accept="image/*"
                className="block max-w-full text-sm text-gray-700"
                onChange={(event) => handleImageSelect(event, "cover")}
              />
              <button
                type="button"
                onClick={() => handleImageUpload(coverFile, "cover")}
                disabled={!coverFile || isUploadingCover}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
              >
                {isUploadingCover ? "Uploading..." : "Upload Cover"}
              </button>
            </div>
          </div>
        </div>

        {/* Profile photo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6">
          <img
            src={profilePreview || Profile}
            alt="Profile"
            className="w-35 h-35 rounded-full object-cover border-4 border-white shadow-md"
          />

          <div className="bg-orange-100 px-6 py-4 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <FaCamera className="text-orange-500 text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Change Profile Photo
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG up to 5 MB
                </p>
              </div>
            </div>

            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              className="block max-w-full text-sm"
              onChange={(event) => handleImageSelect(event, "profile")}
            />

            <button
              type="button"
              onClick={() => handleImageUpload(profileFile, "profile")}
              disabled={!profileFile || isUploadingProfile}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:opacity-50"
            >
              {isUploadingProfile ? "Uploading..." : "Upload Photo"}
            </button>
          </div>
        </div>

        {/* Profile form */}
        <form onSubmit={handleSaveChanges}>
          <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-gray-900 font-medium"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Priyanka Choudhary"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full mt-1 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-900 font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="pc@gmail.com"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full mt-1 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="course"
                  className="block text-gray-900 font-medium"
                >
                  Course
                </label>
                <input
                  id="course"
                  type="text"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                  placeholder="Computer Science and Engineering"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full mt-1 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-gray-900 font-medium"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+91 9876543210"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full mt-1 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="university"
                  className="block text-gray-900 font-medium"
                >
                  University
                </label>
                <input
                  id="university"
                  type="text"
                  value={university}
                  onChange={(event) => setUniversity(event.target.value)}
                  placeholder="SRIT Jabalpur"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full mt-1 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="block text-gray-900 font-medium"
                >
                  Year
                </label>
                <input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  placeholder="Final Year"
                  className="border border-gray-300 px-3 py-2 rounded-md w-full mt-1 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="p-6">
            <label htmlFor="bio" className="block text-xl font-bold mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Tell something about yourself..."
              className="border border-gray-300 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {bio.length}/300 characters
            </p>
          </div>

          {/* Form buttons */}
          <div className="flex justify-end gap-4 px-6 pb-6">
            <button
              type="button"
              className="border border-gray-300 text-gray-700 bg-white rounded-md py-2 px-5 hover:bg-gray-50"
              onClick={handleCancelButton}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-orange-500 text-white py-2 px-5 rounded-md hover:bg-orange-600 disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;