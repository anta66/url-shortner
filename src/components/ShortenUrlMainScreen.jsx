import { useState } from "react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShortenUrlMainScreen = () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const apiUrl = import.meta.env.VITE_BASE_URL

  const [url, setUrl] = useState("")
  const [shortnedUrl, setShortnedUrl] = useState("")

  const handleInput = (event) => {
    setUrl(event.target.value)
  }

  const validateUrl = (inputUrl) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(inputUrl);
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    const isValidUrl = validateUrl(url);

    if (!isValidUrl) {
      toast.error("Invalid url format");
      setUrl("");
      return;
    }
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "spoo-me-url-shortener.p.rapidapi.com",
      },
      body: new URLSearchParams({
        url: url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setShortnedUrl(data.short_url)
        setUrl("");
      });
  };

  const copyToClipoard = () => {
    if (shortnedUrl) {
      navigator.clipboard
        .writeText(shortnedUrl)
        .then(() =>
          toast.success(`Copied to clipboard , ${shortnedUrl}`)
        )
        .catch((err) => toast.error(`unable to copy to the clipboard, ${err}`));
    } else {
      toast.error("please wait for the shortened url to be generated");
    }
  };

  return (
    <div className="short-url-modal">
      <h1>SHORT YOUR LINK</h1>
      <input
        type="text"
        className="url-input"
        placeholder="Enter the link here"
        value={url}
        onChange={handleInput}
        required
      />
      <button
        className="short-url-button"
        onClick={handleSubmit}>
        Shorten URL
      </button>

      {shortnedUrl &&
        <div className="shortned-url-container">
          <p>{shortnedUrl}</p>
          <button
            className="copy-btn"
            onClick={copyToClipoard}
            aria-label="Copy URL"
          >
            copy
          </button>

        </div>}
      <ToastContainer />
    </div>
  )
}

export default ShortenUrlMainScreen