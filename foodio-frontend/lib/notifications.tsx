import toast from 'react-hot-toast';

export const showSuccessToast = (itemTitle: string) => {
    toast.custom((t: any) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-sm w-full bg-white shadow-xl rounded-[16px] pointer-events-auto flex ring-1 ring-black/5 p-4`}
        >
            <div className="flex-1 w-0 flex items-center">
                <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-[#008A45] flex items-center justify-center">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm text-[#1B3B36] leading-snug">
                        <span className="font-bold font-serif">{itemTitle}</span> <span className="text-gray-500">Ordered!</span>
                    </p>
                </div>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="inline-flex text-gray-400 hover:text-[#1B3B36] transition-colors"
                >
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    ), {
        duration: 3000,
        position: 'top-right'
    });
};
