'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Form,
    Input,
    Select,
    Upload,
    ConfigProvider,
    theme
} from 'antd';
import {
    UploadCloud,
    CheckCircle2,
    User,
    Car,
    FileText,
    ArrowRight,
    ChevronLeft,
    Loader2,
    Image as ImageIcon,
    User as UserIcon,
    CreditCard,
    Calendar,
    MapPin,
    Mail,
    Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { setCookie } from 'cookies-next/client';
import { useCreateDriverMutation, useUploadImageMutation } from '@/redux/features/driver/driverApi';

type FieldType = {
    fullName: string;
    nidNumber: string;
    dateOfBirth: string;
    address: string;
    email?: string;
    vehicleType: string;
    model: string;
    numberPlate: string;
    manufacturingYear: string;
    licenseFrontUrl: string;
    licenseBackUrl: string;
    nidUrl: string;
    regPaperUrl: string;
    vehiclePhotoUrl: string;
    selfieUrl: string;
};

const STEPS = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'vehicle', label: 'Vehicle Info', icon: Car },
    { id: 'documents', label: 'Documents', icon: FileText },
];

export default function DriverOnboardingPage() {
    const [form] = Form.useForm();
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [tempDriver, setTempDriver] = useState<any>(null);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    // Redux API Hooks
    const [uploadImage] = useUploadImageMutation();
    const [createDriver, { isLoading: isSubmitting }] = useCreateDriverMutation();

    // Load Temp Driver Info from localStorage
    useEffect(() => {
        const rawData = localStorage.getItem('pending_driver_onboarding');
        if (rawData) {
            try {
                setTempDriver(JSON.parse(rawData));
            } catch (err) {
                console.error('Failed to parse pending_driver_onboarding data', err);
            }
        }
    }, []);

    // Step Validation Handler
    const handleNextStep = async () => {
        try {
            if (step === 0) {
                await form.validateFields(['fullName', 'nidNumber', 'dateOfBirth', 'address', 'email']);
            } else if (step === 1) {
                await form.validateFields(['vehicleType', 'model', 'numberPlate', 'manufacturingYear']);
            }
            setStep((prev) => prev + 1);
        } catch (error) {
            // Ant Design displays validation error in red automatically
        }
    };

    // Image Upload Handler (FormData key: "document")
    const handleFileUpload = async (fieldName: string, file: File) => {
        setUploadingField(fieldName);
        const formData = new FormData();
        formData.append('document', file);

        try {
            const res = await uploadImage(formData).unwrap();

            if (res?.url) {
                form.setFieldValue(fieldName, res.url);
                form.validateFields([fieldName]);
                toast.success('Document uploaded successfully!');
            } else {
                toast.error('Failed to retrieve image URL');
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to upload document');
        } finally {
            setUploadingField(null);
        }
    };

    // Final Form Submit Handler
    const onFinish = async () => {
        const values = form.getFieldsValue(true) as FieldType;

        try {
            const payload = {
                fullName: values.fullName,
                nidNumber: values.nidNumber,
                dateOfBirth: values.dateOfBirth,
                address: values.address,
                email: values.email || tempDriver?.email,
                phoneNumber: tempDriver?.phoneNumber || tempDriver?.identifier,
                tempUserId: tempDriver?._id,
                vehicleInfo: {
                    vehicleType: values.vehicleType,
                    model: values.model,
                    numberPlate: values.numberPlate,
                    manufacturingYear: values.manufacturingYear,
                },
                documents: {
                    licenseFrontUrl: values.licenseFrontUrl,
                    licenseBackUrl: values.licenseBackUrl,
                    nidUrl: values.nidUrl,
                    regPaperUrl: values.regPaperUrl,
                    vehiclePhotoUrl: values.vehiclePhotoUrl,
                    selfieUrl: values.selfieUrl,
                },
            };

            const response = await createDriver(payload).unwrap();

            if (response?.success) {
                if (response?.token) {
                    setCookie('token', response.token, { maxAge: 12 * 24 * 60 * 60 });
                }
                localStorage.removeItem('pending_driver_onboarding');
                toast.success(response?.message || 'Onboarding completed successfully!');
                router.push('/driver/auth/verification-pending');
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to complete onboarding');
        }
    };


    const documentFields = [
        { name: 'licenseFrontUrl', label: 'Driving License (Front Side)' },
        { name: 'licenseBackUrl', label: 'Driving License (Back Side)' },
        { name: 'nidUrl', label: 'National ID (NID) Card' },
        { name: 'regPaperUrl', label: 'Vehicle Registration Document' },
        { name: 'vehiclePhotoUrl', label: 'Vehicle Photo' },
        { name: 'selfieUrl', label: 'Your Selfie Photo' },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#38bdf8', // Sky 400
                    colorBgContainer: '#070b14', // Inner input dark background
                    colorBgElevated: '#0a0f1a', // Dropdown dark background
                    colorBorder: '#1e293b',
                    colorText: '#f8fafc',
                    colorTextPlaceholder: '#475569',
                    borderRadius: 12,
                },
                components: {
                    Input: {
                        colorBgContainer: '#070b14',
                        activeBorderColor: '#38bdf8',
                        hoverBorderColor: '#334155',
                        colorText: '#f8fafc',
                        paddingInlineLG: 14,
                        paddingBlockLG: 10,
                    },
                    Select: {
                        colorBgContainer: '#070b14',
                        activeBorderColor: '#38bdf8',
                        hoverBorderColor: '#334155',
                        colorText: '#f8fafc',
                    },
                },
            }}
        >
            <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">

                <main className="max-w-2xl mx-auto px-4 py-8">
                    {/* Step Progress Bar */}
                    <div className="flex items-center gap-2 mb-8">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-2 ${i <= step ? 'text-sky-400' : 'text-slate-600'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i <= step ? 'border-sky-500 bg-sky-500/15' : 'border-slate-800'
                                        }`}>
                                        <s.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold hidden sm:inline">{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-px ${i < step ? 'bg-sky-500' : 'bg-slate-800'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Form Container */}
                    <div className="bg-[#0d1420] border border-slate-800/80 rounded-3xl p-6 shadow-2xl">
                        <Form
                            form={form}
                            name="driver_onboarding"
                            layout="vertical"
                            autoComplete="off"
                            onFinish={onFinish}
                            requiredMark={false}
                            preserve={true}
                        >
                            {/* STEP 1: PERSONAL INFORMATION */}
                            {step === 0 && (
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold text-slate-100 mb-4">Personal Information</h2>

                                    {/* Full Name */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Full Name</span>}
                                        name="fullName"
                                        rules={[{ required: true, message: 'Please input your full name!' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Enter your full name"
                                            prefix={<UserIcon className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                        />
                                    </Form.Item>

                                    {/* NID Number */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">National ID (NID) Number</span>}
                                        name="nidNumber"
                                        rules={[
                                            { required: true, message: 'Please input your NID number!' },
                                            { min: 10, message: 'NID must be at least 10 digits!' },
                                            { max: 10, message: 'NID  maximum 10 digits!' }
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Enter NID number"
                                            prefix={<CreditCard className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                        />
                                    </Form.Item>

                                    {/* Date of Birth */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Date of Birth</span>}
                                        name="dateOfBirth"
                                        rules={[{ required: true, message: 'Please select your date of birth!' }]}
                                    >
                                        <Input
                                            type="date"
                                            size="large"
                                            prefix={<Calendar className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                        />
                                    </Form.Item>

                                    {/* Address */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Home Address</span>}
                                        name="address"
                                        rules={[{ required: true, message: 'Please input your address!' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Enter your present address"
                                            prefix={<MapPin className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                        />
                                    </Form.Item>
                                </div>
                            )}

                            {/* STEP 2: VEHICLE INFORMATION */}
                            {step === 1 && (
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold text-slate-100 mb-4">Vehicle Information</h2>

                                    {/* Vehicle Type */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Vehicle Type</span>}
                                        name="vehicleType"
                                        rules={[{ required: true, message: 'Please select a vehicle type!' }]}
                                    >
                                        <Select
                                            size="large"
                                            placeholder="Select Vehicle Type"
                                            options={[
                                                { value: 'Car', label: 'Car' },
                                                { value: 'Bike', label: 'Bike' },
                                                { value: 'Haice', label: 'Haice' },
                                                { value: 'Auto/CNG', label: 'Auto / CNG' },
                                            ]}
                                        />
                                    </Form.Item>

                                    {/* Vehicle Model */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Vehicle Model</span>}
                                        name="model"
                                        rules={[{ required: true, message: 'Please input vehicle model!' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="e.g. Toyota Axio / Honda Livo"
                                            prefix={<Car className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                        />
                                    </Form.Item>

                                    {/* Number Plate */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Number Plate</span>}
                                        name="numberPlate"
                                        rules={[{ required: true, message: 'Please input number plate!' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="e.g. DHAKA-METRO-GA-11-2222"
                                            prefix={<Tag className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                            className="uppercase"
                                        />
                                    </Form.Item>

                                    {/* Manufacturing Year */}
                                    <Form.Item<FieldType>
                                        label={<span className="text-slate-300 font-medium">Manufacturing Year</span>}
                                        name="manufacturingYear"
                                        rules={[{ required: true, message: 'Please input manufacturing year!' }]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="e.g. 2020"
                                            prefix={<Calendar className="w-4 h-4 text-sky-400 shrink-0 mr-1.5" />}
                                        />
                                    </Form.Item>
                                </div>
                            )}

                            {/* STEP 3: DOCUMENTS UPLOAD */}
                            {step === 2 && (
                                <div className="space-y-4 w-full">
                                    <h2 className="text-lg font-bold text-slate-100 mb-1">Upload Documents</h2>
                                    <p className="text-xs text-slate-400 mb-4">
                                        Upload clear photos. Files will be uploaded individually.
                                    </p>

                                    {documentFields.map((doc) => {
                                        const currentValue = form.getFieldValue(doc.name);
                                        const isUploading = uploadingField === doc.name;

                                        return (
                                            <Form.Item<FieldType>
                                                key={doc.name}
                                                name={doc.name as keyof FieldType}
                                                rules={[{ required: true, message: `${doc.label} is required!` }]}
                                                className="w-full mb-4 [&>.ant-form-item-row]:w-full [&_.ant-form-item-control-input-content]:w-full"
                                            >
                                                <div className="w-full">
                                                    <Upload
                                                        beforeUpload={(file) => {
                                                            handleFileUpload(doc.name, file);
                                                            return false; // Prevent automatic submit
                                                        }}
                                                        showUploadList={false}
                                                        accept="image/*,application/pdf"
                                                        className="w-full block [&>.ant-upload]:w-full [&>.ant-upload]:block"
                                                    >
                                                        <div className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer relative ${currentValue
                                                                ? 'bg-emerald-500/[0.06] border-emerald-500/30'
                                                                : 'bg-[#070b14] border-slate-800 hover:border-slate-700'
                                                            }`}>
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isUploading ? 'bg-sky-500/15' : currentValue ? 'bg-emerald-500/15' : 'bg-slate-900'
                                                                }`}>
                                                                {isUploading ? (
                                                                    <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
                                                                ) : currentValue ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                                ) : (
                                                                    <UploadCloud className="w-5 h-5 text-sky-400" />
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-semibold text-slate-200">{doc.label}</div>
                                                                <div className="text-xs text-slate-500 truncate mt-0.5">
                                                                    {isUploading ? (
                                                                        <span className="text-sky-400 font-medium animate-pulse">Uploading document...</span>
                                                                    ) : currentValue ? (
                                                                        <span className="text-emerald-400 font-medium">Uploaded & Attached ✓</span>
                                                                    ) : (
                                                                        'Tap to upload (JPG, PNG, PDF)'
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {currentValue && !isUploading && (
                                                                <div className="shrink-0 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                                                                    <ImageIcon className="w-3.5 h-3.5" />
                                                                    <span>Ready</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Upload>
                                                </div>
                                            </Form.Item>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ACTION BUTTON (FULL WIDTH) */}
                            <Form.Item className="mb-0 mt-6">
                                {step < STEPS.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="w-full bg-sky-500 hover:bg-sky-400 text-[#070b14] font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] cursor-pointer"
                                    >
                                        <span>Continue</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !!uploadingField}
                                        className="w-full bg-sky-500 hover:bg-sky-400 text-[#070b14] font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 shadow-[0_8px_24px_-8px_rgba(56,189,248,0.6)] cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Submitting Application...</span>
                                            </div>
                                        ) : uploadingField ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Uploading File...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span>Submit for Review</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </Form.Item>
                        </Form>
                    </div>
                </main>
            </div>
        </ConfigProvider>
    );
}