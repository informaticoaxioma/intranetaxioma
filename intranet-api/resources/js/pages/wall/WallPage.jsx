import React, { useState, useEffect, useCallback } from "react";
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
    CircularProgress,
    Badge,
    Dialog,
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
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    AddPhotoAlternate as AddPhotoAlternateIcon,
    Collections as CollectionsIcon,
} from "@mui/icons-material";
import {
    getWallPosts,
    createWallPost,
    deleteWallPost,
    createWallComment,
    deleteWallComment,
    reactToWallPost,
} from "../../services/api";
import { renderTextWithLinks } from "../../components/LinkifiedText";

const isVideoUrl = (url) => {
    if (!url) return false;
    const cleanUrl = url.split("?")[0].toLowerCase();
    const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".ogg", ".ogv"];
    return videoExtensions.some((ext) => cleanUrl.endsWith(ext));
};

const getPostMediaList = (post) => {
    if (Array.isArray(post.imagenes_urls) && post.imagenes_urls.length > 0) {
        return post.imagenes_urls;
    }
    if (post.imagen_url) {
        return [post.imagen_url];
    }
    return [];
};

export default function WallPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states (supports multiple photos/videos)
    const [newPostText, setNewPostText] = useState("");
    const [selectedMedia, setSelectedMedia] = useState([]); // [{ file, previewUrl, isVideo }]
    const [submittingPost, setSubmittingPost] = useState(false);

    // Comment states
    const [commentTexts, setCommentTexts] = useState({}); // key: postId, value: commentText

    // Facebook-style Lightbox state
    const [lightbox, setLightbox] = useState({
        open: false,
        mediaList: [],
        currentIndex: 0,
        post: null,
    });

    useEffect(() => {
        loadPosts();
    }, []);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            selectedMedia.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            });
        };
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

    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newItems = files.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            isVideo: file.type?.startsWith("video/"),
        }));

        setSelectedMedia((prev) => [...prev, ...newItems]);
        e.target.value = "";
    };

    const handleRemoveMediaItem = (indexToRemove) => {
        setSelectedMedia((prev) => {
            const target = prev[indexToRemove];
            if (target?.previewUrl) {
                URL.revokeObjectURL(target.previewUrl);
            }
            return prev.filter((_, idx) => idx !== indexToRemove);
        });
    };

    const handleClearAllMedia = () => {
        selectedMedia.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        setSelectedMedia([]);
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostText.trim() && selectedMedia.length === 0) return;

        try {
            setSubmittingPost(true);
            const formData = new FormData();
            formData.append("contenido", newPostText);

            if (selectedMedia.length > 0) {
                formData.append("imagen", selectedMedia[0].file);
                selectedMedia.forEach((item) => {
                    formData.append("imagenes[]", item.file);
                });
            }

            const response = await createWallPost(formData);
            // Append new post immediately to state to maintain async real-time feel
            setPosts((prev) => [response, ...prev]);

            // Reset form
            setNewPostText("");
            handleClearAllMedia();
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
            setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
        } catch (err) {
            console.error(err);
            alert(err.message || "Error al reaccionar.");
        }
    };

    // Lightbox handlers
    const handleOpenLightbox = (post, index = 0) => {
        const mediaList = getPostMediaList(post);
        if (mediaList.length === 0) return;
        setLightbox({
            open: true,
            mediaList,
            currentIndex: index,
            post,
        });
    };

    const handleCloseLightbox = useCallback(() => {
        setLightbox((prev) => ({ ...prev, open: false }));
    }, []);

    const handlePrevLightbox = useCallback(
        (e) => {
            if (e) e.stopPropagation();
            setLightbox((prev) => ({
                ...prev,
                currentIndex:
                    prev.currentIndex === 0
                        ? prev.mediaList.length - 1
                        : prev.currentIndex - 1,
            }));
        },
        []
    );

    const handleNextLightbox = useCallback(
        (e) => {
            if (e) e.stopPropagation();
            setLightbox((prev) => ({
                ...prev,
                currentIndex:
                    prev.currentIndex === prev.mediaList.length - 1
                        ? 0
                        : prev.currentIndex + 1,
            }));
        },
        []
    );

    useEffect(() => {
        if (!lightbox.open) return;
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft" && lightbox.mediaList.length > 1) {
                handlePrevLightbox();
            } else if (e.key === "ArrowRight" && lightbox.mediaList.length > 1) {
                handleNextLightbox();
            } else if (e.key === "Escape") {
                handleCloseLightbox();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightbox.open, lightbox.mediaList.length, handlePrevLightbox, handleNextLightbox, handleCloseLightbox]);

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
                        <Avatar
                            src={
                                user?.path_foto_perfil
                                    ? `${import.meta.env.VITE_API_URL || "https://intranet.axioma.cl"}/storage/${user.path_foto_perfil}`
                                    : undefined
                            }
                            sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: "#7b1e3f",
                            }}
                        >
                            {`${user?.name?.[0] || ""}${user?.apellido?.[0] || ""}`.toUpperCase() || "U"}
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

                            {/* Multi-Media Preview (Facebook-style composer preview) */}
                            {selectedMedia.length > 0 && (
                                <Box className="mt-3 p-3 rounded-xl border border-gray-200 bg-gray-50/80 space-y-2.5">
                                    <Box className="flex items-center justify-between">
                                        <Typography variant="caption" className="font-semibold text-[#4A1C23] flex items-center gap-1.5">
                                            <CollectionsIcon sx={{ fontSize: 16 }} />
                                            {selectedMedia.length}{" "}
                                            {selectedMedia.length === 1 ? "archivo seleccionado" : "archivos seleccionados"}
                                        </Typography>
                                        {selectedMedia.length > 1 && (
                                            <Button
                                                size="small"
                                                onClick={handleClearAllMedia}
                                                sx={{
                                                    textTransform: "none",
                                                    color: "#b91c1c",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    py: 0.2,
                                                }}
                                            >
                                                Quitar todas
                                            </Button>
                                        )}
                                    </Box>

                                    <Box className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {selectedMedia.map((item, idx) => (
                                            <Box
                                                key={item.previewUrl}
                                                className="relative group rounded-lg overflow-hidden border border-gray-200 bg-black/5 aspect-square"
                                            >
                                                {item.isVideo ? (
                                                    <video
                                                        src={item.previewUrl}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                    />
                                                ) : (
                                                    <img
                                                        src={item.previewUrl}
                                                        alt={`Vista previa ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveMediaItem(idx)}
                                                    className="!absolute top-1.5 right-1.5 !bg-black/65 hover:!bg-black/85 !text-white shadow-sm"
                                                    sx={{ width: 26, height: 26 }}
                                                >
                                                    <CloseIcon sx={{ fontSize: 15 }} />
                                                </IconButton>
                                            </Box>
                                        ))}

                                        {/* Add More Tile */}
                                        <Box
                                            component="label"
                                            className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#6a1936]/30 hover:border-[#6a1936] hover:bg-[#6a1936]/5 cursor-pointer transition-colors aspect-square text-[#6a1936]"
                                        >
                                            <AddPhotoAlternateIcon sx={{ fontSize: 28 }} />
                                            <Typography variant="caption" className="font-semibold mt-1 text-center px-2">
                                                Agregar más
                                            </Typography>
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/*,video/*"
                                                onChange={handleMediaChange}
                                            />
                                        </Box>
                                    </Box>
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
                                    Subir Fotos / Videos / GIF
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*,video/*"
                                        onChange={handleMediaChange}
                                    />
                                </Button>

                                <Button
                                    onClick={handleCreatePost}
                                    disabled={submittingPost || (!newPostText.trim() && selectedMedia.length === 0)}
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
                        const mediaList = getPostMediaList(post);

                        return (
                            <Card
                                key={post.id}
                                className="shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 rounded-2xl overflow-hidden bg-white"
                            >
                                {/* Post Top Bar */}
                                <CardContent className="p-5 pb-3">
                                    <Box className="flex justify-between items-start">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                src={
                                                    post.user?.path_foto_perfil
                                                        ? `${import.meta.env.VITE_API_URL || "https://intranet.axioma.cl"}/storage/${post.user.path_foto_perfil}`
                                                        : undefined
                                                }
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    backgroundColor: "#7b1e3f",
                                                }}
                                            >
                                                {`${post.user?.name?.[0] || ""}${post.user?.apellido?.[0] || ""}`.toUpperCase() || "U"}
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
                                    {post.contenido && (
                                        <Typography className="text-gray-800 whitespace-pre-line mt-4 mb-3">
                                            {renderTextWithLinks(post.contenido)}
                                        </Typography>
                                    )}

                                    {/* Post Media (Facebook-style Collage Grid) */}
                                    {mediaList.length > 0 && (
                                        <PostMediaGrid
                                            mediaList={mediaList}
                                            onSelectMedia={(idx) => handleOpenLightbox(post, idx)}
                                        />
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
                                            {post.comments?.length || 0} comentario{post.comments?.length !== 1 && "s"}
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
                                                        src={
                                                            comment.user?.path_foto_perfil
                                                                ? `${import.meta.env.VITE_API_URL || "https://intranet.axioma.cl"}/storage/${comment.user.path_foto_perfil}`
                                                                : undefined
                                                        }
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                            backgroundColor: "#7b1e3f",
                                                        }}
                                                    >
                                                        {`${comment.user?.name?.[0] || ""}${comment.user?.apellido?.[0] || ""}`.toUpperCase() || "U"}
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
                                                        <Typography className="text-gray-700 text-sm mt-1 leading-relaxed whitespace-pre-line">
                                                            {renderTextWithLinks(comment.contenido)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>

                                    {/* New Comment Input */}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar
                                            src={
                                                user?.path_foto_perfil
                                                    ? `${import.meta.env.VITE_API_URL || "https://intranet.axioma.cl"}/storage/${user.path_foto_perfil}`
                                                    : undefined
                                            }
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                backgroundColor: "#7b1e3f",
                                            }}
                                        >
                                            {`${user?.name?.[0] || ""}${user?.apellido?.[0] || ""}`.toUpperCase() || "U"}
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

            {/* Facebook-style Lightbox Modal */}
            <Dialog
                open={lightbox.open}
                onClose={handleCloseLightbox}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "#0f0f0f",
                        color: "white",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.75)",
                    },
                }}
            >
                {lightbox.mediaList.length > 0 && (
                    <Box className="flex flex-col h-[85vh] max-h-[850px]">
                        {/* Top Bar */}
                        <Box className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10">
                            <Box className="flex items-center gap-3 min-w-0">
                                {lightbox.post?.user && (
                                    <Avatar
                                        src={
                                            lightbox.post.user?.path_foto_perfil
                                                ? `${import.meta.env.VITE_API_URL || "https://intranet.axioma.cl"}/storage/${lightbox.post.user.path_foto_perfil}`
                                                : undefined
                                        }
                                        sx={{ width: 32, height: 32, bgcolor: "#7b1e3f" }}
                                    >
                                        {`${lightbox.post.user?.name?.[0] || ""}${lightbox.post.user?.apellido?.[0] || ""}`.toUpperCase() || "U"}
                                    </Avatar>
                                )}
                                <Box className="min-w-0">
                                    <Typography variant="subtitle2" className="font-semibold text-white truncate">
                                        {lightbox.post?.user
                                            ? `${lightbox.post.user.name} ${lightbox.post.user.apellido || ""}`
                                            : "Publicación"}
                                    </Typography>
                                    <Typography variant="caption" className="text-gray-400 block">
                                        Fotografía {lightbox.currentIndex + 1} de {lightbox.mediaList.length}
                                    </Typography>
                                </Box>
                            </Box>

                            <IconButton
                                onClick={handleCloseLightbox}
                                sx={{
                                    color: "white",
                                    bgcolor: "rgba(255,255,255,0.1)",
                                    "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {/* Main Media Stage */}
                        <Box
                            className="relative flex-1 flex items-center justify-center bg-black overflow-hidden select-none"
                            onClick={handleCloseLightbox}
                        >
                            <Box
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-full flex items-center justify-center p-2 sm:p-6"
                            >
                                {isVideoUrl(lightbox.mediaList[lightbox.currentIndex]) ? (
                                    <video
                                        src={lightbox.mediaList[lightbox.currentIndex]}
                                        controls
                                        autoPlay
                                        className="max-w-full max-h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <img
                                        src={lightbox.mediaList[lightbox.currentIndex]}
                                        alt={`Imagen ${lightbox.currentIndex + 1}`}
                                        className="max-w-full max-h-full object-contain rounded-lg transition-all duration-200"
                                    />
                                )}
                            </Box>

                            {/* Navigation Arrows */}
                            {lightbox.mediaList.length > 1 && (
                                <>
                                    <IconButton
                                        onClick={handlePrevLightbox}
                                        sx={{
                                            position: "absolute",
                                            left: { xs: 8, sm: 20 },
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            bgcolor: "rgba(255,255,255,0.15)",
                                            color: "white",
                                            width: 44,
                                            height: 44,
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                        }}
                                    >
                                        <ChevronLeftIcon fontSize="large" />
                                    </IconButton>
                                    <IconButton
                                        onClick={handleNextLightbox}
                                        sx={{
                                            position: "absolute",
                                            right: { xs: 8, sm: 20 },
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            bgcolor: "rgba(255,255,255,0.15)",
                                            color: "white",
                                            width: 44,
                                            height: 44,
                                            "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                                        }}
                                    >
                                        <ChevronRightIcon fontSize="large" />
                                    </IconButton>
                                </>
                            )}
                        </Box>

                        {/* Thumbnail Strip */}
                        {lightbox.mediaList.length > 1 && (
                            <Box className="flex items-center justify-center gap-2 px-4 py-3 bg-black/80 border-t border-white/10 overflow-x-auto">
                                {lightbox.mediaList.map((url, idx) => {
                                    const isActive = idx === lightbox.currentIndex;
                                    return (
                                        <Box
                                            key={`${url}-${idx}`}
                                            onClick={() =>
                                                setLightbox((prev) => ({
                                                    ...prev,
                                                    currentIndex: idx,
                                                }))
                                            }
                                            className={`relative w-14 h-14 rounded-lg overflow-hidden cursor-pointer shrink-0 transition-all ${
                                                isActive
                                                    ? "ring-2 ring-[#e11d48] scale-105 opacity-100"
                                                    : "opacity-50 hover:opacity-85"
                                            }`}
                                        >
                                            {isVideoUrl(url) ? (
                                                <video src={url} className="w-full h-full object-cover" muted />
                                            ) : (
                                                <img
                                                    src={url}
                                                    alt={`Miniatura ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                )}
            </Dialog>
        </Box>
    );
}

/**
 * Facebook-style photo/video collage grid inside a publication
 */
function PostMediaGrid({ mediaList, onSelectMedia }) {
    const count = mediaList.length;

    const renderTile = (url, idx, className = "", extraOverlay = null) => {
        const isVideo = isVideoUrl(url);
        return (
            <Box
                key={`${url}-${idx}`}
                onClick={() => onSelectMedia(idx)}
                className={`relative overflow-hidden bg-gray-100 cursor-pointer group ${className}`}
            >
                {isVideo ? (
                    <video
                        src={url}
                        controls={count === 1}
                        className={`w-full h-full ${
                            count === 1 ? "object-contain max-h-[480px]" : "object-cover"
                        } transition-transform duration-300 group-hover:scale-[1.02]`}
                    />
                ) : (
                    <img
                        src={url}
                        alt={`Publicación ${idx + 1}`}
                        className={`w-full h-full ${
                            count === 1 ? "object-contain max-h-[480px]" : "object-cover"
                        } transition-transform duration-300 group-hover:scale-[1.02]`}
                    />
                )}
                <Box className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                {extraOverlay}
            </Box>
        );
    };

    if (count === 1) {
        return (
            <Box className="mt-3 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                {renderTile(mediaList[0], 0, "w-full max-h-[480px] flex items-center justify-center")}
            </Box>
        );
    }

    if (count === 2) {
        return (
            <Box className="mt-3 rounded-xl overflow-hidden border border-gray-100 grid grid-cols-2 gap-1 h-[280px] sm:h-[340px]">
                {renderTile(mediaList[0], 0, "h-full")}
                {renderTile(mediaList[1], 1, "h-full")}
            </Box>
        );
    }

    if (count === 3) {
        return (
            <Box className="mt-3 rounded-xl overflow-hidden border border-gray-100 grid grid-cols-2 gap-1 h-[340px] sm:h-[420px]">
                {renderTile(mediaList[0], 0, "h-full")}
                <Box className="grid grid-rows-2 gap-1 h-full">
                    {renderTile(mediaList[1], 1, "h-full")}
                    {renderTile(mediaList[2], 2, "h-full")}
                </Box>
            </Box>
        );
    }

    if (count === 4) {
        return (
            <Box className="mt-3 rounded-xl overflow-hidden border border-gray-100 grid grid-cols-2 grid-rows-2 gap-1 h-[340px] sm:h-[420px]">
                {mediaList.slice(0, 4).map((url, idx) => renderTile(url, idx, "h-full"))}
            </Box>
        );
    }

    // 5 or more photos: Facebook 2 on top + 3 on bottom with "+N" overlay on the 5th photo
    const remainingCount = count - 5;
    return (
        <Box className="mt-3 rounded-xl overflow-hidden border border-gray-100 space-y-1">
            <Box className="grid grid-cols-2 gap-1 h-[200px] sm:h-[250px]">
                {renderTile(mediaList[0], 0, "h-full")}
                {renderTile(mediaList[1], 1, "h-full")}
            </Box>
            <Box className="grid grid-cols-3 gap-1 h-[140px] sm:h-[175px]">
                {renderTile(mediaList[2], 2, "h-full")}
                {renderTile(mediaList[3], 3, "h-full")}
                {renderTile(
                    mediaList[4],
                    4,
                    "h-full",
                    remainingCount > 0 ? (
                        <Box className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center transition-colors group-hover:bg-black/70">
                            <Typography className="text-white font-bold text-2xl sm:text-3xl tracking-tight">
                                +{remainingCount}
                            </Typography>
                        </Box>
                    ) : null
                )}
            </Box>
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
                    <Badge
                        badgeContent={count}
                        color="primary"
                        max={999}
                        sx={{
                            "& .MuiBadge-badge": {
                                backgroundColor: active ? "inherit" : "#94a3b8",
                                color: "white",
                                fontSize: "10px",
                                height: "16px",
                                minWidth: "16px",
                                padding: "0 2px",
                            },
                        }}
                    >
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
