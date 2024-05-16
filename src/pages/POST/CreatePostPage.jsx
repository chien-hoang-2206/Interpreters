import { Button, Image, Input } from '@nextui-org/react';
import { Divider } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { AuthContext } from '../../context/auth.context';
import PostFactories from '../../services/PostFatories';
import { useNavigate } from 'react-router-dom';
import { CameraOutlined } from '@ant-design/icons';
import IMDefault from '../../assets/images/images_default.png'
import { uploadFirebase } from '../../utils/FirebaseService';
import { ToastNoti } from '../../utils/Utils';

const PreviewContent = ({ content, title }) => {
    return (
        <div className="p-4 rounded">
            <span className="text-2xl font-bold my-5">{title}</span>
            <div className='preview-content text-justify mt-5' dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

const CreatePostPage = () => {
    const { user } = useContext(AuthContext)
    const [loading, setLoading] = useState();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value) => {
        setContent(value);
    };

    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)


        const url = await uploadFirebase(fileUpload);

        const newBlog = {
            title,
            content,
            image: url,
            user_id: user.id
        };
        try {
            setLoading(true)
            const response = await PostFactories.createPost(newBlog);
            if (response.status === 200) {
                navigate(`/post/${response.data.id}`)
                ToastNoti(t('create_post_success'))
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "color", "image"],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ["clean"],
        ],
    };
    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
        "indent",
        "image",
        "code-block",
        "color",
    ];
    const processContent = (value) => {
        return value
    };

    const [imageLink, setImageLinK] = useState([]);
    const [fileUpload, setFileUpload] = useState([]);

    const handleChange = (e) => {
        const file = e.target.files[0];
        setFileUpload(e.target.files[0]);
        if (file) {
            const url = URL.createObjectURL(file);
            setFileUpload(file)
            setImageLinK(url);
        }
    };


    const { t } = useTranslation()
    return (
        <div className="w-full container mx-auto py-8 px-[10%]">
            <h1 className="w-full text-4xl font-bold text-center mb-6">{t('add_post')}</h1>
            <div className="w-full flex flex-row gap-10 justify-between">

                <div className="p-5 rounded-lg border border-gray-300 w-full ">
                    <span className="text-2xl font-bold">{t('edit_post')}</span>
                    <Divider />

                    <Input
                        type="text"
                        label={t('title')}
                        value={title}
                        onChange={handleTitleChange}
                        placeholder={t('enter_title')}
                        className="w-full py-2 rounded mb-4 focus:outline-none focus:border-blue-500"
                    />

                    <input
                        id="uploadInput"
                        type="file"
                        className='uploadInput'
                        style={{ display: 'none' }}
                        onChange={(e) => handleChange(e)}
                    />

                    <Image
                        src={imageLink}
                        alt="avatar"
                        className="max"
                        style={{ width: 100, height: 100, marginBottom: 20 }}
                        fallback="data:image/png;base64,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"
                    />

                    <Button className="w-fit px-0  pr-3" color="primary" endContent={<CameraOutlined />}>
                        <label htmlFor="uploadInput" className='w-44'>
                            Đính kèm ảnh
                        </label>
                    </Button>

                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Viết nội dung ở đây..."
                        className="bg-white rounded mt-5"
                    />
                    <Button
                        isLoading={loading}
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4"
                    >
                        Đăng bài
                    </Button>
                </div>



                {/* demo */}
                <div className="p-5 rounded-lg border border-gray-300 w-full ">
                    <span className="text-2xl font-bold">{t('Preview')}</span>
                    <Divider />
                    <PreviewContent title={title} content={processContent(content,)} />

                </div>
            </div>

        </div>
    );
};

export default CreatePostPage;