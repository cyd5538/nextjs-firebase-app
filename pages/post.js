import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {addDoc,collection,doc,serverTimestamp,updateDoc} from "firebase/firestore";
import { auth, db, storage } from "../utils/firebase";
import {getDownloadURL,ref,uploadString,uploadBytes,} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import {toast} from 'react-toastify'
// select box
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

// option box
import Select from 'react-select'
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

//text editior
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
const  modules  = {
  toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script:  "sub" }, { script:  "super" }],
      ["blockquote", "code-block"],
      [{ list:  "ordered" }, { list:  "bullet" }],
      [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
  ],
};

// datepicker
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

export default function Post() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState(null);
  const [changeFile, setChangeFile] = useState({ image: null });
  const [user, loading] = useAuthState(auth);
  const [loadings, setLoadings] = useState(false);
  const route = useRouter();
  const filePickerRef = useRef(null);
  const routeData = route.query;

  // dateFicker
  const [value, setValue] = useState(null);
  // 데이터 문자열로
  const dateFormat = dayjs(value).format("YYYY-MM-DD");


  // select options 1
  const project = [
    { name: "스터디" },
    { name: "프로젝트" },
  ];
  const [selected, setSelected] = useState(project[0]);

  // select options 2
  const people = [
    { name: "1명" },
    { name: "2명" },
    { name: "3명" },
    { name: "4명" },
    { name: "5명" },
    { name: "6명" },
    { name: "7명" },
    { name: "8명" },
    { name: "9명" },
    { name: "10명" },
  ];
  const [selected2, setSelected2] = useState(people[0]);

  // select options 3
  const playing = [
    { name: "온라인" },
    { name: "오프라인" },

  ];
  const [selected3, setSelected3] = useState(playing[0]);

  // select options 4
  const day = [
    { name: "1개월" },
    { name: "2개월" },
    { name: "3개월" },
    { name: "4개월" },
    { name: "5개월" },
    { name: "6개월" },
    { name: "장기" },
    { name: "아직 미정" }

  ];
  const [selected4, setSelected4] = useState(day[0]);

  // select options 5
  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "React", label: "React" },
    { value: "Vue", label: "Vue" },
    { value: "Svelte", label: "Svelte" },
    { value: "Nextjs", label: "Nextjs" },
    { value: "Nodejs", label: "Nodejs" },
    { value: "Java", label: "Java" },
    { value: "Spring", label: "Spring" },
    { value: "go", label: "go" },
  ];
  const [selectedOptions, setSelectedOptions] = useState('');


  const handleSelect = () => {
    console.log(selectedOptions);
  };


  async function uploadPost() {
    if (loadings) return;
    setLoadings(true);


    // query로 넘긴 id값이 있을때는 update
    
    if (routeData?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", routeData.id);
      const updatedPost = {
        title,
        text,
        recruitment : selected.name,
        player : selected2.name,
        progress: selected3.name,
        period: selected4.name,
        stack : selectedOptions,
        startday: dateFormat,
        username: user.displayName,
        user: user.uid,
        avatar: user.photoURL,
        timestamp: serverTimestamp(),
      }
      const imageRef = ref(storage, `posts/${docRef.id}/image`);
      if(selectedFile !== null){
        await uploadString(imageRef, selectedFile, "data_url").then(
          async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "posts", docRef.id), {
              image: downloadURL,
            });
          }
        );
      }
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      // firestore에 저장

      const docRef = await addDoc(collection(db, "posts"), {
        title,
        text,
        recruitment : selected.name,
        player : selected2.name,
        progress: selected3.name,
        period: selected4.name,
        stack : selectedOptions,
        startday: dateFormat,
        username: user.displayName,
        user: user.uid,
        avatar: user.photoURL,
        timestamp: serverTimestamp(),
      });

      // storage에 저장하면서 docRef posts에 넣어줌
      const imageRef = ref(storage, `posts/${docRef.id}/image`);
      if(selectedFile !== null){
        await uploadString(imageRef, selectedFile, "data_url").then(
          async (snapshot) => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "posts", docRef.id), {
              image: downloadURL,
            });
          }
        );
      }
      setLoadings(false);
      setSelectedFile(null);
      route.push("/");
    }
    
  }

  function addImageToPost(e) {
    // 이미지 미리보기
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  }

  // checkuser
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/login");
    if (routeData.id) {
      setTitle(
        routeData.title 
      );
      setText(
        routeData.text 
      )
      setChangeFile({
        image: routeData.image
      })
    }
  };
  
  useEffect(() => {
    checkUser();
  }, [loading, user]);

  return (
    <div>
      <div className="flex flex-col justify-start items-start h-[100%] p-4">
        <div className="flex mb-16">
          <h1 className="text-2xl font-bold">
            1. 프로젝트 기본 정보를 입력해주세요.
          </h1>
        </div>
        <div className="w-full flex gap-4 mb-10">
          <div className="w-full">
            <label className="text-xl">모집 구분</label>
            <div className="w-full pt-2 pb-2 select1">
              <Listbox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-6 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-xl">{selected.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-40 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {project.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none sm:text-lg py-4 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div className="w-full">
            <label className="text-xl">모집 인원</label>
            <div className="w-full pt-2 pb-2">
              <Listbox value={selected2} onChange={setSelected2}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-6 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-xl">{selected2.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-40 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {people.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none sm:text-lg py-4 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-4 mb-10">
          <div className="w-full">
            <label className="text-xl">진행 방식</label>
            <div className="w-full pt-2 pb-2 select1">
              <Listbox value={selected3} onChange={setSelected3}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-6 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-xl">{selected3.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="z-40 absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {playing.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none sm:text-lg py-4 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div className="w-full">
            <label className="text-xl">진행 기간</label>
            <div className="w-full pt-2 pb-2">
              <Listbox value={selected4} onChange={setSelected4}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-6 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate text-xl">{selected4.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="z-40 absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {day.map((person, personIdx) => (
                        <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none sm:text-lg py-4 pl-10 pr-4 ${
                              active
                                ? "bg-amber-100 text-amber-900"
                                : "text-gray-900"
                            }`
                          }
                          value={person}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {person.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
        <div className="w-full flex gap-4 mb-10">
          <div className="w-full">
            <label className="text-xl">기술 스택</label>
            <Select
              components={animatedComponents}
              isMulti
              options={options}
              onChange={(item) => setSelectedOptions(item)}
              className="select relative w-full cursor-default rounded-lg bg-white py-6 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
              isClearable={true}
              isSearchable={true}
              isDisabled={false}
              isLoading={false}
              isRtl={false}
              closeMenuOnSelect={false}
            />
          </div>
          <div className="w-full flex flex-wrap ">
           <label className="text-xl mb-2">시작 날짜</label> 
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label=""
              value={value}
              className="w-full"
                                
              onChange={(newValue) => {
                setValue(newValue);
              }}

              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          </div>
        </div>
        <div className="mb-20">
          <h2 className="text-xl font-bold">썸네일 이미지를 넣어주세요</h2>
        </div>
        {selectedFile ? (
          <img
            onClick={() => setSelectedFile(null)}
            src={selectedFile}
            alt=""
            className="w-1/2 m-auto max-h-[300px] object-cover cursor-pointer"
          />
        ) : (
          <>
          {routeData?.image ? (
            <img
            src={routeData.image}
            onClick={() => filePickerRef.current.click()}
            className="w-1/2 m-auto max-h-[300px] object-cover cursor-pointer"
          ></img>
          ) : (
            <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAgVBMVEX///8BAQEAAAD5+fk+Pj78/Pz09PTg4OBUVFTR0dHl5eXs7Ozc3Nx7e3uoqKjExMR1dXWcnJxISEg3Nze+vr6UlJRfX1+urq7w8PCHh4fKyspPT08dHR1nZ2eNjY23t7coKCgPDw9sbGwyMjKZmZmDg4MWFhZCQkIcHBxiYmIkJCQvhB9VAAAKtElEQVR4nO1d63riKhQdo0aNMcZ7rTXe6vS07/+Ax2gDO3cIrIDzuf7N1MBeAfYNsvnz54UXXnjhhRdeaBn9bt+0CPrh+tNgFa57R4fjozc8R8Fy9GZaOEV0R8FkTng5nQfofy3C2ftz8hxswo8UrWL88tzPfNMCS2G82ddzy/EcBgPTgovBj45S7FIsr++mxa+Dv+00okdYhhaTfJt9KLAjJLd2Ttf3taBWEdE+i4NpOjkEpzK5qWlwjovF4nIqMCD5ZyKbbIgbFYv64HAaXmeH0cBNOTOuN1oG2/VPKc3b/549U4QycK9FMt4ln28Pfo2X5i1Xw2KWsQGxwUoW8XsY8UBcPO8QngpY3v5nbXwcVzm5Ykl7DVwULxjmScZz1QWILYxNkUi7TVMd0V/ucyRv/15plVkG/iUvzSVQe+X9w66A41KTxJKY5CWZ6NAM49zMv82LsYaGJTHNiOE4fwNtjS97udb1NS6G/ndWgsVUawd+xkO6ddDqML5n+c1H2vvw9lmOLQ7jNft69fOL4a0z/QxbyvG8pVTozSvDaTq/l+GIeZUZTDOdzqC9LZ3068T2dkeU7vEb7nFkOlyj+6NL4/Z624jHvdRUdX6gUZV7TL3PCbIvgiA9jMCAY5DuqZVlf8f4kpo6MNU2SnWzbjU9H6X6BlnGaaqTDaaTUqRfLyTc2KS6aD8b1v2iSwSgAlIE50Y2kGgwo58iIeg4V92tywvRcUJY2+0HMhwj2ChOKUG9YZIcPEox0tfuiBI0m+BzPwhFbU7qgBI0nt27EGE0mX6XEjSQL8liQcTR41YdSYtW7CUsNL/xtV0jGINM1L/qrUU2rcEEZFoNVdvidsK0FqWgqkHRZowJQZN2MAsql1oUTma8OU+mCD6hqJJIuXKCpnzRMhw4xa/mrfDErzPXJ5smEBXYOFrsk5lg4Xm7HZeuabT6rd4EEmQA/mvWwpRPg7ZTFmIg2qaZyeDPw7OwDTFTm2QTqxfhA3Mm40X+YTYF2syLyoL7Ng3MNXPgW8tsN8GBT7Su5KMb/ihENF0YMjllM1N8+C0+DPmHzFNZZbNiBL9BoulCwCTdyTxG3ozRE0kiYLGilEZkHncbe66KYIlAZyH+EB/CE04ybWBpFokIlg+hoeNWUhjLD6LbZNwN4iqt96NGa9cc+IgIRrF92QeMY8uGRCxZFjzZENJB3Av9/vRcqzDGVcp8vzdQvqbxxgZRJGWTmBcdCfPWcGaDWP9b/jrsSpBWw5eYeDOJt9EEnmwcJ4YknBXIuCR7rJjAdxJ/QoHYojsI6xpf0rTIYXFbAg4mXhFeXInxdI4AKX4trXMGtJ0kzmpz/B2knvnNUkOW+IhN0+pF4Av+rhl6SesIbXMSG5vE6ZZLCYgCylBQ9CQlgMnjQxny6VfVehJMgtIzUIZ8mlaF7UmW1OkhRAAz3IpY8n3yI0wCCsswCRkqk0vMbGKOXWAZcunLT8UMwD4pmGGS4XfKP3Vny1AsVJYGmCELGsq3MEJw4ARmyNyaY+lPPrDLEM3wT62t64KXIZxhsiVcmkJjo4zKIqIZRnXGLkkjOluMAHCGhzpVM6nXtmpAM/SS9svOLczBigbOkKuaur+jTpfAGV6qvRoXvmkIZ8jSpsWbUCzAUj5YXAY4w+T4QUl4m5xjwx0lhTNkyrT4nFtQZ02UAWc4qjYXK7SxwDNk5qI4VxPW+TzKgDPsJubgWPhntukEOy4LZ1hjEFn/sENCphmyTCLsOCmeYfUo1bk86ki+Vcb1kJxuL/5CSwvDYNcrxRfLaJb/pve1UplCTJcUum064t+FU4lOJ+mjCgpbJsweFAYPGo5gsLPhKlARoNLi9TUwVK7t+ZCgefQ2qWLYVWfoaSGocl6wkqGGMexrGsPmTlUlQx3rcK1lHSqoumrPU0MA/FZWclWGn4pfXKNLNdhD96xsLYYqbvF3tT3U49N0S0F8qoofKaHap/mA+1R4v5T5hYVew78QW5wqR2lYOYd1wHT09C/F+D+Ff2b7GrBPEOAMx9V7SyzXBjtY2l6urXgTe4neesIzZBSK86XsBcA++4UznFVPw7fkz8XLVAPgDJmyLDkLDU/UwBmyDko8vwXaIBrfPwzR5gLNkBmLj5IfsHWKKvOOZjitNhbk6BtqAxHN8DNp/7PkB0yZPut5mnWNKhU63KeEls5ElcROMdjxUtAOIpihwNFKgcN9SgAzZEcry7/nYGcVQKcxwAzZFKwIHcALsa0zwhU586HAW1AAlqEvYgoCrEXEMlzV2fsYXBtB9oGxDNmRr8qvYdiHXRDXFMqQOaXV+49XkZFuDChDZuqqS0a9Q6cplCGbpGVO6S8cpFvzBQyx2d5l3XEgFiMiPs/71XYQTc00aVlsmIBPU0BF3ccOKqZGoSM4SckvEWHw2/2sBiKnzoLfendsK+IZNIe/xOwZMG+svpgpK0/+FPWFEvA6QwIfv7KMG+YrSwykZh4v1GdP7edasCEUqgTBfm1rUc88ZqLG8IFIXC3ZAsm6T7x+C+hDS+3gdZ8Eiwadn20Q2ZCI7il5T7YS+SoUrpPAzOdTqFNefa0j/AyvsPsMNvEqP4S02KL9js24wRDSlWh3jd0YvM6uVEh7Zo9pvHIIAlZXXbIqEilCa7nFaFzwmBcStlvZ8Lrq0kkJlVrg7cFXmGtLxtCWG4KKcGJSNjjmxK+PaFCzviWEfBgaPE0uq7FVn5KLjBrV6SR3K9hZqpXcG9Cwrjq/PAB35FUF6vKReapwHQ8M5CKjxr5lwNuw7wqIAxdOoQ7jkLdi21Uz5JIZlVMH9D4ku7QN0TJqQeyINGSVg8ov61QtkDDjLdl0EQS//Vg900IueKzbt2oPeoX64a3Z4r6dycTS4DSz9GnHlirtISGoRf/5llHkBLVFdkvHpom6JwS1fRkSkEaPhjUq+RBXZ03piDRrNiD+IpJoPfAwoRTNJcJTt3JrrgyYoggrQlQDovMApQ+pBjMU9B+gBDOjuDNwJeIVTDBWNyYXo9vjvcO+CJmlKLZ7X9nUoQQRVw/csUxRnLdoGcNUz7BPQGm42KpO9U8pgtAk/PhviuKwlWGcpN8rOtkwTHeH39SYpqqJOD94lypKUzxiX+k480ZbOTvxTvuMO8W91f4201dL+2DuV/q9OlfQcpyly904p/aM8Crzap0tgGOQ4YezgkUY/JfleNV8MU1m/G5dtH0sJMoK4Jz1zaHxNsfvu/3NocElx3GhxwWYDnP8DN3jl1kod0kmqsbDi5x8s0A3rRrdMCNLzPEUNZ+t49klVy3sFqqZ3E8Y7HLly2KS2yaXefurPL3YpTB9MfhokS/Rdi9KNpOZr4PNPjc57w11TGVMKKaXvGiPimzz6FA/wcbTz7VTRC/mZ8uu5fu8sNbeo8Lc5bw6jArudeyPR8tZ2HOK2cVP/9jCL4Z/LqsnyIvp9XbrMAwnkzD83n2dcnX4sk/Nbbvo1V2VipsmWk0t+e0EVnJbBdN1peCCiEfbpumZhrvpKZGMH/75tGo7PY+3YNeQ5F0tfVo5O7PoLien6pVWyM7ZbxAXZ6LgHcJjjUIh3G7sgmf48CELdzQLL2W6k/33x/5z+kxjl4f3vonOu2POWPzM91EwfYplJwp37PmjGL43tuhozgsvvPDCCy+88MJT4H9GVGzT0MxrEgAAAABJRU5ErkJggg=="
            onClick={() => filePickerRef.current.click()}
            className="w-1/4 m-auto max-h-[300px] object-cover cursor-pointer"
          ></img>
          )}
          </>
        )}
        <input
          type="file"
          hidden
          ref={filePickerRef}
          onChange={addImageToPost}
        />
        <input
          type="text"
          maxLength="30"
          placeholder="제목을 입력해주세요"
          className="m-4 mt-10 mb-10 border-none text-center pt-2 pb-2 w-full focus:ring-0 text-purple-900 bold"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="w-full"> 
          <ReactQuill 
          className="w-full h-96" 
          value={text} 
          onChange={setText}
          modules={modules}
          />
        </div>
        <button
          onClick={uploadPost}
          className="w-full mt-20 mb-4 bg-gray-700 text-white p-2 shadow-md hover:brightness-125 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          {routeData?.hasOwnProperty("id") ? <div>Edit Post</div> : <div>Upload Post</div>}
        </button>
      </div>
    </div>
  );
}
