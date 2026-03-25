import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Container, Box, TextField, Button, Typography,
  Paper, Avatar, IconButton, Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Feed = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [comment, setComment] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
    setPosts(res.data);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!text && !imageUrl) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/posts`,
      { text, imageUrl },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setText('');
    setImageUrl('');
    fetchPosts();
  };

  const handleLike = async (postId) => {
    await axios.put(`${process.env.REACT_APP_API_URL}/posts/${postId}/like`, {},
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    fetchPosts();
  };

  const handleComment = async (postId) => {
    if (!comment[postId]) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/posts/${postId}/comment`,
      { text: comment[postId] },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setComment({ ...comment, [postId]: '' });
    fetchPosts();
  };

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', pb: 4 }}>
      {/* Navbar */}
      <Box sx={{ backgroundColor: '#1976d2', px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" color="white" fontWeight="bold">📢 Social</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography color="white">👤 {user.username}</Typography>
          <Button variant="outlined" color="inherit" size="small" onClick={logout}
            sx={{ color: 'white', borderColor: 'white' }}>
            Logout
          </Button>
        </Box>
      </Box>

      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {/* Create Post */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>Create Post</Typography>
          <TextField fullWidth multiline rows={3} placeholder="What's on your mind?"
            value={text} onChange={(e) => setText(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth placeholder="Image URL (optional)"
            value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} sx={{ mb: 2 }} />
          <Button fullWidth variant="contained" onClick={handlePost}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}>
            Post
          </Button>
        </Paper>

        {/* Posts Feed */}
        {posts.map((post) => (
          <Paper key={post._id} elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            {/* Post Header */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Avatar sx={{ backgroundColor: '#1976d2' }}>
                {post.author[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight="bold">{post.author}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Post Content */}
            {post.text && <Typography mb={2}>{post.text}</Typography>}
            {post.imageUrl && (
              <Box mb={2}>
                <img src={post.imageUrl} alt="post"
                  style={{ width: '100%', borderRadius: 8 }} />
              </Box>
            )}

            <Divider sx={{ mb: 1 }} />

            {/* Like and Comment */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <IconButton onClick={() => handleLike(post._id)} color="error">
                {post.likes.includes(user.username)
                  ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography>{post.likes.length} Likes</Typography>
              <ChatBubbleOutlineIcon sx={{ ml: 2 }} color="action" />
              <Typography>{post.comments.length} Comments</Typography>
            </Box>

            {/* Comments */}
            {post.comments.map((c, i) => (
              <Box key={i} sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, p: 1, mb: 1 }}>
                <Typography variant="caption" fontWeight="bold">{c.username}: </Typography>
                <Typography variant="caption">{c.text}</Typography>
              </Box>
            ))}

            {/* Add Comment */}
            <Box display="flex" gap={1} mt={1}>
              <TextField fullWidth size="small" placeholder="Write a comment..."
                value={comment[post._id] || ''}
                onChange={(e) => setComment({ ...comment, [post._id]: e.target.value })}
              />
              <Button variant="contained" size="small"
                onClick={() => handleComment(post._id)}>
                Send
              </Button>
            </Box>
          </Paper>
        ))}
      </Container>
    </Box>
  );
};

export default Feed;