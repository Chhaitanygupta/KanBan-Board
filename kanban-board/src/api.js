const BASE_URL = "http://localhost:8000"; 

export async function fetchBoards() {
  try {
    const response = await fetch(`${BASE_URL}/board`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }
    const data = await response.json();
    return data.board;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw error;
  }
}

export async function addBoard(title) {
  try {
    const response = await fetch(`${BASE_URL}/board`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) {
      throw new Error("Failed to add board");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding board:", error);
    throw error;
  }
}

export async function saveBoard(board) {
  try {
    const response = await fetch(`${BASE_URL}/board`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ board }),
    });
    if (!response.ok) {
      throw new Error("Failed to save board");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error saving board:", error);
    throw error;
  }
}

export async function removeBoard(boardId) {
    try {
      const response = await fetch(`${BASE_URL}/board/${boardId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to remove board");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error removing board:", error);
      throw error;
    }
  }