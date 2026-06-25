import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    Avatar,
    Divider,
    Stack,
    Tooltip,
    Alert,
    Paper,
    CircularProgress,
    Badge,
} from "@mui/material";
import {
    ThumbUp,
    ThumbUpOutlined,
    SentimentVerySatisfied,
    SentimentVerySatisfiedOutlined,
    ThumbDown,
    ThumbDownOutlined,
    Delete,
    Send,
    Image as ImageIcon,
    Close as CloseIcon,
    Forum as ForumIcon,
} from "@mui/icons-material";
import {
    getWallPosts,
    createWallPost,
    deleteWallPost,
    createWallComment,
    deleteWallComment,
    reactToWallPost,
} from "../../services/api";

export default function WallPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [newPostText, setNewPostText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submittingPost, setSubmittingPost] = useState(false);

    // Comment states
    const [commentTexts, setCommentTexts] = useState({}); // key: postId, value: commentText

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await getWallPosts();
            setPosts(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message || "Error al cargar las publicaciones.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText.trim() && !selectedImage) return;

        try {
            setSubmittingPost(true);
            const formData = new FormData();
            formData.append("contenido", newPostText);
            if (selectedImage) {
                formData.append("imagen", selectedImage);
            }

            const response = await createWallPost(formData);
            // Append new post immediately to state to maintain async real-time feel
            setPosts((prev) => [response, ...prev]);

            // Reset form
            setNewPostText("");
            setSelectedImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error(err);
            alert(err.message || "Error al publicar.");
        } finally {
            setSubmittingPost(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;

        try {
            await deleteWallPost(postId);
            // Remove from state immediately
            setPosts((prev) => prev.filter((p) => p.id !== postId));
        } catch (err) {
            console.error(err);
            alert(err.message || "No se pudo eliminar la publicación.");
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentTexts((prev) => ({
            ...prev,
            [postId]: text,
        }));
    };

    const handleCreateComment = async (postId) => {
        const text = commentTexts[postId];
        if (!text || !text.trim()) return;

        try {
            const commentResponse = await createWallComment(postId, { contenido: text });

            // Append to post's comment list in state immediately
            setPosts((prev) =>
                prev.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: [...(post.comments || []), commentResponse],
                        };
                    }
                    return post;
                })
            );

            // Clear comment input
            setCommentTexts((prev) => ({
                ...prev,
                [postId]: "",
            }));
        } catch (err) {
            console.error(err);
            alert(err.message || "Error al comentar.");
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) return;

        try {
            await deleteWallComment(commentId);

            // Remove from post's comment list in state immediately
            setPosts((prev) =>
                prev.map((post) => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            comments: post.comments.filter((c) => c.id !== commentId),
                        };
                    }
                    return post;
                })
            );
        } catch (err) {
            console.error(err);
            alert(err.message || "No se pudo eliminar el comentario.");
        }
    };

    const handleReact = async (postId, tipo) => {
        try {
            const updatedPost = await reactToWallPost(postId, { tipo });
            // Update post in state
            setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
        } catch (err) {
            console.error(err);
            alert(err.message || "Error al reaccionar.");
        }
    };

    // Helper to count reactions
    const getReactionStats = (reactions) => {
        const counts = { like: 0, sorpresa: 0, desaprobar: 0 };
        let userReaction = null;

        reactions?.forEach((r) => {
            counts[r.tipo] = (counts[r.tipo] || 0) + 1;
            if (r.user_id === user.id) {
                userReaction = r.tipo;
            }
        });

        return { counts, userReaction };
    };

    return (
        <Box className="max-w-[850px] mx-auto p-4 md:p-6 space-y-6">
            {/* Header */}
            <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <Box>
                    <Typography variant="h4" className="font-bold text-[#4A1C23] flex items-center gap-2">
                        <ForumIcon className="w-8 h-8 text-[#6a1936]" /> Muro Axioma
                    </Typography>
                    <Typography className="text-gray-500 mt-1">
                        Interactúa y comparte con colaboradores de tu mismo contrato.
                    </Typography>
                </Box>
                {user?.contrato && (
                    <ChipContract label={user.contrato} />
                )}
            </Box>

            {error && (
                <Alert severity="error" className="rounded-xl border border-red-200">
                    {error}
                </Alert>
            )}

            {/* Create Post Card */}
            <Card className="shadow-lg border border-gray-100 rounded-2xl overflow-visible bg-white/70 backdrop-blur-md">
                <CardContent className="p-5">
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar sx={{ bgcolor: "#6a1936", fontWeight: "bold" }}>
                            {user?.name?.charAt(0) || "U"}
                        </Avatar>
                        <Box className="flex-1 space-y-3">
                            <Typography className="font-semibold text-gray-800">
                                {user?.name} {user?.apellido}
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                placeholder={`¿Qué quieres compartir en el Muro de ${user?.contrato || "tu contrato"}?`}
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                variant="outlined"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "white",
                                    },
                                }}
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <Box className="relative inline-block mt-2 max-w-[200px] border rounded-xl overflow-hidden shadow-md bg-gray-50">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-auto object-cover max-h-[150px]"
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={handleClearImage}
                                        className="absolute top-1 right-1 !bg-black/60 hover:!bg-black/80 !text-white"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            <Divider className="my-4" />

                            <Box className="flex justify-between items-center" sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<ImageIcon />}
                                    sx={{
                                        borderRadius: "20px",
                                        textTransform: "none",
                                        color: "#6a1936",
                                        borderColor: "#6a1936",
                                        "&:hover": {
                                            borderColor: "#4a1025",
                                            backgroundColor: "#6a1936/5",
                                        },
                                    }}
                                >
                                    Subir Imagen
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>

                                <Button
                                    onClick={handleCreatePost}
                                    disabled={submittingPost || (!newPostText.trim() && !selectedImage)}
                                    variant="contained"
                                    className="!bg-[#6a1936] hover:!bg-[#4a1025] disabled:!bg-gray-300"
                                    sx={{
                                        borderRadius: "20px",
                                        textTransform: "none",
                                        px: 4,
                                        fontWeight: 600,
                                    }}
                                >
                                    {submittingPost ? <CircularProgress size={20} color="inherit" /> : "Publicar"}
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            {/* Posts List */}
            {loading ? (
                <Box className="flex justify-center py-10">
                    <CircularProgress color="primary" />
                </Box>
            ) : posts.length === 0 ? (
                <Box className="text-center py-12 bg-white/40 border border-dashed rounded-2xl">
                    <Typography className="text-gray-500 font-medium">
                        No hay publicaciones en el muro de tu contrato aún. ¡Sé el primero en compartir algo!
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={4}>
                    {posts.map((post) => {
                        const { counts, userReaction } = getReactionStats(post.reactions);
                        const isPostOwner = post.user_id === user.id;
                        const isAdmin = user.role === "admin";

                        return (
                            <Card
                                key={post.id}
                                className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 rounded-2xl overflow-hidden bg-white"
                            >
                                {/* Post Top Bar */}
                                <CardContent className="p-5 pb-3">
                                    <Box className="flex justify-between items-start">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: "#6a1936", fontWeight: "bold" }}>
                                                {post.user?.name?.charAt(0) || "U"}
                                            </Avatar>
                                            <Box>
                                                <Typography className="font-semibold text-gray-900">
                                                    {post.user ? `${post.user.name} ${post.user.apellido || ""}` : "Colaborador"}
                                                </Typography>
                                                <Typography variant="caption" className="text-gray-400">
                                                    {post.user?.cargo || "Colaborador"} • {new Date(post.created_at).toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        {(isPostOwner || isAdmin) && (
                                            <Tooltip title="Eliminar Publicación">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="hover:!text-red-600 hover:!bg-red-50"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>

                                    {/* Post Text */}
                                    <Typography className="text-gray-800 whitespace-pre-line mt-4 mb-3">
                                        {post.contenido}
                                    </Typography>

                                    {/* Post Image */}
                                    {post.imagen_url && (
                                        <Box className="mt-3 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                            <img
                                                src={post.imagen_url}
                                                alt="Publicación"
                                                className="w-full h-auto object-contain max-h-[450px]"
                                            />
                                        </Box>
                                    )}

                                    <Divider className="mt-4 mb-2" />

                                    {/* Reactions Bar */}
                                    <Box className="flex flex-wrap justify-between items-center gap-2">
                                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                            <ReactionButton
                                                label="Me Gusta"
                                                icon={userReaction === "like" ? <ThumbUp className="text-[#6a1936]" /> : <ThumbUpOutlined />}
                                                count={counts.like}
                                                active={userReaction === "like"}
                                                onClick={() => handleReact(post.id, "like")}
                                            />
                                            <ReactionButton
                                                label="Sorpresa"
                                                icon={userReaction === "sorpresa" ? <SentimentVerySatisfied className="text-[#d97706]" /> : <SentimentVerySatisfiedOutlined />}
                                                count={counts.sorpresa}
                                                active={userReaction === "sorpresa"}
                                                onClick={() => handleReact(post.id, "sorpresa")}
                                            />
                                            <ReactionButton
                                                label="Desaprobar"
                                                icon={userReaction === "desaprobar" ? <ThumbDown className="text-red-700" /> : <ThumbDownOutlined />}
                                                count={counts.desaprobar}
                                                active={userReaction === "desaprobar"}
                                                onClick={() => handleReact(post.id, "desaprobar")}
                                            />
                                        </Stack>

                                        <Typography variant="caption" className="text-gray-400 font-medium">
                                            {post.comments?.length || 0} comentario{(post.comments?.length !== 1) && "s"}
                                        </Typography>
                                    </Box>
                                </CardContent>

                                {/* Comments Section */}
                                <Box className="bg-gray-50 p-4 border-t border-gray-100">
                                    <Stack spacing={2} className="mb-4">
                                        {post.comments?.map((comment) => {
                                            const isCommentOwner = comment.user_id === user.id;
                                            const isCommentPostOwner = post.user_id === user.id;
                                            const isCommentAdmin = user.role === "admin";

                                            return (
                                                <Box
                                                    key={comment.id}
                                                    className="flex gap-2 items-start bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            bgcolor: "#8c2e4f",
                                                            fontSize: "14px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {comment.user?.name?.charAt(0) || "U"}
                                                    </Avatar>
                                                    <Box className="flex-1">
                                                        <Box className="flex justify-between items-start">
                                                            <Box>
                                                                <Typography variant="subtitle2" className="font-semibold text-gray-900 leading-tight">
                                                                    {comment.user ? `${comment.user.name} ${comment.user.apellido || ""}` : "Colaborador"}
                                                                </Typography>
                                                                <Typography variant="caption" className="text-gray-400 leading-none">
                                                                    {comment.user?.cargo || "Colaborador"} • {new Date(comment.created_at).toLocaleString()}
                                                                </Typography>
                                                            </Box>
                                                            {(isCommentOwner || isCommentPostOwner || isCommentAdmin) && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                    className="hover:!text-red-600 hover:!bg-red-50"
                                                                >
                                                                    <Delete sx={{ fontSize: "16px" }} />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                        <Typography className="text-gray-700 text-sm mt-1 leading-relaxed">
                                                            {comment.contenido}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>

                                    {/* New Comment Input */}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: "#6a1936",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {user?.name?.charAt(0) || "U"}
                                        </Avatar>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Escribe un comentario..."
                                            value={commentTexts[post.id] || ""}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleCreateComment(post.id);
                                                }
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "20px",
                                                    backgroundColor: "white",
                                                },
                                            }}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleCreateComment(post.id)}
                                            disabled={!commentTexts[post.id]?.trim()}
                                            sx={{
                                                bgcolor: commentTexts[post.id]?.trim() ? "#6a1936" : "transparent",
                                                color: commentTexts[post.id]?.trim() ? "white" : "gray",
                                                "&:hover": {
                                                    bgcolor: commentTexts[post.id]?.trim() ? "#4a1025" : "transparent",
                                                },
                                            }}
                                        >
                                            <Send fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </Box>
                            </Card>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
}

// Subcomponents for visual excellence
function ChipContract({ label }) {
    return (
        <Box className="px-4 py-1.5 bg-[#6a1936]/10 text-[#6a1936] font-semibold text-sm rounded-full border border-[#6a1936]/20 shadow-sm flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6a1936] animate-pulse"></span>
            Contrato: {label}
        </Box>
    );
}

function ReactionButton({ icon, count, active, onClick, label }) {
    return (
        <Tooltip title={label}>
            <Button
                onClick={onClick}
                startIcon={
                    <Badge badgeContent={count} color="primary" max={999} sx={{
                        "& .MuiBadge-badge": {
                            backgroundColor: active ? "inherit" : "#94a3b8",
                            color: "white",
                            fontSize: "10px",
                            height: "16px",
                            minWidth: "16px",
                            padding: "0 2px"
                        }
                    }}>
                        {icon}
                    </Badge>
                }
                sx={{
                    borderRadius: "16px",
                    textTransform: "none",
                    px: 2.5,
                    py: 0.5,
                    fontSize: "13px",
                    fontWeight: active ? 600 : 500,
                    color: active ? "primary.dark" : "text.secondary",
                    bgcolor: active ? "action.selected" : "transparent",
                    "&:hover": {
                        bgcolor: "action.hover",
                    },
                }}
            >
                {label}
            </Button>
        </Tooltip>
    );
}
