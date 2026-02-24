export async function deleteCategoryById(id) {
  if (!id) throw new Error("Missing category id")

  const baseurl = import.meta.env.VITE_BASE_URL
  if (!baseurl) throw new Error("VITE_BASE_URL is not set. Check your .env and Vite config.")

  const token = localStorage.getItem("token")
  if (!token) throw new Error("Not authenticated: missing token in localStorage")

  // Ensure no duplicate slashes
  const url = `${baseurl.replace(/\/$/, "")}/api/categories/${id}`

  try {
    // Useful for debugging — remove or guard in production
    // console.log("DELETE", url, "token:", !!token)

    const resp = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const text = await resp.text()
    let body
    try {
      body = text ? JSON.parse(text) : {}
    } catch {
      body = text
    }

    if (!resp.ok) {
      const message =
        (body && (body.message || body.error)) ||
        (typeof body === "string" && body) ||
        resp.statusText ||
        `Request failed with status ${resp.status}`
      const err = new Error(message)
      err.status = resp.status
      err.body = body
      console.error("deleteCategoryById failed:", { url, status: resp.status, body })
      throw err
    }

    return body
  } catch (err) {
    console.error("deleteCategoryById error:", err)
    throw err
  }
}
