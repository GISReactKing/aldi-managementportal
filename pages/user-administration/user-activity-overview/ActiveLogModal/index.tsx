/** @format */

import { Fragment, useRef } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Button, Grid, Avatar } from "antd";
import { CircleCloseIcon } from "../../../../components/Icons";

const { useBreakpoint } = Grid;

interface Props {
  children?: any;
  showModal: boolean;
  onCloseModal: (v: boolean) => void;
  onDelete?: () => void;
  onExport?: () => void;
}

export default function AppModal({
  children,
  showModal,
  onCloseModal,
  onDelete,
  onExport,
}: Props) {
  const cancelButtonRef = useRef(null);
  const { sm, md } = useBreakpoint();

  return (
    // <Transition.Root show={showModal} as={Fragment}>
    //   <Dialog
    //     as='div'
    //     className='fixed z-40 inset-0 overflow-y-auto flex justify-center items-center md:p-6 xsm:p-4'
    //     initialFocus={cancelButtonRef}
    //     onClose={() => onCloseModal(false)}>
    //     <div className='flex items-center justify-center min-h-full w-full'>
    //       <Transition.Child
    //         as={Fragment}
    //         enter='ease-out duration-300'
    //         enterFrom='opacity-0'
    //         enterTo='opacity-25'
    //         leave='ease-in duration-200'
    //         leaveFrom='opacity-25'
    //         leaveTo='opacity-0'>
    //         <Dialog.Overlay
    //           style={{ backgroundColor: '#091E42', opacity: 0.25 }}
    //           className='fixed inset-0 transition-opacity z-50 md:p-6 xsm:p-4'
    //         />
    //       </Transition.Child>

    //       <Transition.Child
    //         as={Fragment}
    //         enter='ease-out duration-300'
    //         enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
    //         enterTo='opacity-100 translate-y-0 sm:scale-100'
    //         leave='ease-in duration-200'
    //         leaveFrom='opacity-100 translate-y-0 sm:scale-100'
    //         leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
    //         <div
    //           style={{ width: '731px', height: 'auto' }}
    //           className='z-50 p-4 flex  flex-col inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all'>
    //           <div className='flex md:flex-row xsm:flex-col md:items-center md:justify-between xsm:items-start xsm:mb-0'>
    //             <h1
    // style={{color:theme?.monoTitle}}
    // className='md:text-xmd xsm:text-sm font-bold'>Activity Log</h1>
    //             <div className='flex  items-center'>
    //               <div className='xsm:absolute xsm:right-0 xsm:bottom-4 md:right-0 md:bottom-0 md:relative w-full flex justify-between px-4'>
    //                 <Button
    //                   style={{
    //                     width: md ? 98 : '100%',
    //                     height: 44,
    //                     borderColor: theme?.secondaryFire,
    //                     color: theme?.secondaryFire,
    //                   }}
    //                   className='rounded border-1'
    //                   onClick={onDelete}>
    //                   Delete
    //                 </Button>

    //                 <Button
    //                   style={{
    //                     width: md ? 98 : '100%',
    //                     height: 44,
    //                     backgroundColor: '#54C2F0',
    //                   }}
    //                   className='border-0 text-white rounded xsm:ml-2 md:ml-6'
    //                   onClick={onExport}>
    //                   Export
    //                 </Button>
    //               </div>
    //               <span
    //                 onClick={() => onCloseModal(false)}
    //                 className='xsm:ml-2 md:ml-9 xsm:absolute md:relative xsm:right-2 xsm:top-2 md:right-0 md:top-0'>
    //                 <CircleCloseIcon size={md ? 52 : 26} />
    //               </span>
    //             </div>
    //           </div>

    //           <div className='w-full mt-2'>
    //             <span style={{color:theme?.monoLightTitle}} className='xsm:text-12 md:text-18 font-bold'>Date:</span>
    //             <span
    // style={{color:theme?.monoTitle}}
    // className='xsm:text-12 md:text-18 font-bold ml-1'>18/10/2021 10:40 AM</span>
    //           </div>

    //           <div>
    //             <p style={{color:theme?.monoTitle}} className='sm:text-sm xsm:text-12 font-bold xsm:mt-3 md:mt-6 lg:mt-8 '>
    //               User Information
    //             </p>
    //             <div className='flex'>
    //               <div>
    //                 <Avatar
    //                   shape='square'
    //                   className='mt-2'
    //                   size={sm ? 162 : 100}
    //                   // icon={ alt='user image' src={activityUser} />}
    //                   icon={<img alt='user image' src="assets/img/activity-user.png" />}
    //                 />
    //               </div>
    //               <span className='md:mt-6 xsm:mt-2 xsm:ml-2 md:ml-4 xsm:mt-1 xsm:ml-0'>
    //                 <p className='sm:text-sm md:text-18 xsm:text-12 text-mono'>
    //                   <span className='text-mono'>Courtney Henry</span>
    //                   <span style={{backgroundColor:theme?.lightBlue}}className='text-12 text-primary-sea py-0.5 px-1 ml-2'>ALDI</span>
    //                 </p>
    //                 <p className='sm:text-sm md:text-18 xsm:text-12 text-mono xsm:mt-2 sm:mt-3'>tobsuiux@gmail.com</p>
    //                 <p className='xsm:mb-1 sm:mb-3 xsm:mt-2 sm:mt-3 md:text-18 sm:text-sm xsm:text-12 text-mono'>
    //                   Developer
    //                 </p>
    //                 <span className='text-primary-sea underline md:text-18 sm:text-sm xsm:text-12'>
    //                   <Link href='#'>View User</Link>
    //                 </span>
    //               </span>
    //             </div>
    //           </div>

    //           <div>
    //             <p style={{color:theme?.monoTitle}} className='sm:text-sm xsm:text-12 font-bold mt-3 mb-2'>Activity Description</p>
    //             <span className='text-primary-sea underline md:text-18 sm:text-sm xsm:text-12'>
    //               <Link href='#'>http://localhost:5000/login/Carrier/Edit/successful</Link>
    //             </span>
    //           </div>

    //           <div className='xsm:mb-16 md:mb-0'>
    //             <p style={{color:theme?.monoTitle}} className='sm:text-sm xsm:text-12 font-bold mt-3 mb-2'>Status</p>
    //             <div className='flex mt-2.5'>
    //               <span
    //                style={{backgroundColor:theme?.monoTagSuccess}} className={`max-w-83 h-29 px-4 flex items-center justify-center rounded border-1
    //           ${'border-secondary-fire text-secondary-fire'}
    //             text-12`}>
    //                 Failed
    //               </span>
    //               <span
    //                 style={{backgroundColor:theme?.monoTagSuccess}} className={`max-w-102 h-29 px-4 flex items-center justify-center rounded border-1 ml-5
    //           ${'border-secondary-fire text-secondary-fire'}
    //             text-12`}>
    //                 Unauthorized
    //               </span>
    //             </div>
    //           </div>
    //         </div>
    //       </Transition.Child>
    //     </div>
    //   </Dialog>
    // </Transition.Root>
    <></>
  );
}
