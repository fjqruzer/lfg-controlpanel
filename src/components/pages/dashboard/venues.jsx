import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Option,
  Switch,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  StatusChip,
  VenueCard,
} from "@/components/ui";
import { HomeIcon, PlusIcon, MapPinIcon, TableCellsIcon, ListBulletIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useNotifications } from "@/context/notifications";
import { getVenues, createVenue } from "@/services/venueService";

export function Venues() {
  const { notify } = useNotifications();
  const [venues, setVenues] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [form, setForm] = React.useState({
    name: "",
    address: "",
    region: "",
    playerCapacity: "",
    spectatorCapacity: "",
    notes: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    openHours: "",
    sportType: "",
    surface: "",
    mapUrl: "",
  });
  const [enabled, setEnabled] = React.useState(true);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [dragIndex, setDragIndex] = React.useState(null);
  const [legalDocs, setLegalDocs] = React.useState([]); // {name, size, type}
  const [errors, setErrors] = React.useState({});
  const [viewMode, setViewMode] = React.useState("grid"); // 'grid' | 'list'
  const amenitiesOptions = [
    "Parking",
    "Restrooms",
    "Locker Rooms",
    "Showers",
    "Water Station",
    "First Aid",
    "Lighting",
    "Scoreboard",
    "Seating/Bleachers",
    "Accessibility",
  ];
  const [amenities, setAmenities] = React.useState([]);
  const [indoor, setIndoor] = React.useState(false);
  const [covered, setCovered] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [current, setCurrent] = React.useState(null);
  const [customAmenityOpen, setCustomAmenityOpen] = React.useState(false);
  const [customAmenity, setCustomAmenity] = React.useState("");

  // Load venues from service
  React.useEffect(() => {
    const loadVenues = async () => {
      try {
        setLoading(true);
        const data = await getVenues();
        setVenues(data);
      } catch (error) {
        console.error('Failed to load venues:', error);
        notify('Failed to load venues', { color: 'red', icon: true });
      } finally {
        setLoading(false);
      }
    };
    loadVenues();
  }, []);

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));
  const MAX_IMAGES = 8;
  const MAX_SIZE_MB = 5;
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  // Legal documents constraints
  const MAX_DOCS = 5;
  const MAX_DOC_SIZE_MB = 10;
  const DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const processFiles = (files) => {
    let valid = [];
    for (const f of files) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        notify(`Unsupported file type: ${f.type || f.name}`, { color: "red", icon: true });
        continue;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        notify(`${f.name} exceeds ${MAX_SIZE_MB}MB`, { color: "red", icon: true });
        continue;
      }
      valid.push(f);
    }
    if (valid.length === 0) return;
    const remain = MAX_IMAGES - imagePreviews.length;
    if (remain <= 0) {
      notify(`Maximum of ${MAX_IMAGES} images reached`, { color: "red", icon: true });
      return;
    }
    const chosen = valid.slice(0, remain);
    const urls = chosen.map((f) => URL.createObjectURL(f));
    setImagePreviews((arr) => [...arr, ...urls]);
    if (valid.length > remain) {
      notify(`Only the first ${remain} image(s) were added (limit ${MAX_IMAGES})`, { color: "amber", icon: true });
    }
  };

  const onImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };
  const onDropUpload = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer?.files || []);
    processFiles(files);
  };
  const removeImage = (idx) => {
    setImagePreviews((arr) => {
      try { if (arr[idx]) URL.revokeObjectURL(arr[idx]); } catch {}
      return arr.filter((_, i) => i !== idx);
    });
  };
  const onDragStartImage = (idx) => setDragIndex(idx);
  const onDragOverImage = (e) => e.preventDefault();
  const onDropImage = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    setImagePreviews((arr) => {
      const copy = [...arr];
      const [moved] = copy.splice(dragIndex, 1);
      copy.splice(idx, 0, moved);
      return copy;
    });
    setDragIndex(null);
  };
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Venue name is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.region) errs.region = "Region is required";
    if (form.playerCapacity === "" || Number(form.playerCapacity) <= 0)
      errs.playerCapacity = "Player capacity must be greater than 0";
    if (form.sportType.trim() === "") errs.sportType = "Sport type is required";
    if (
      form.name &&
      venues.some((v) => v.name.trim().toLowerCase() === form.name.trim().toLowerCase())
    ) {
      errs.name = errs.name || "Venue name already exists";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const slugify = (text) =>
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  const uniqueSlug = (base, existing) => {
    let s = slugify(base);
    if (!existing.has(s)) return s;
    let i = 2;
    while (existing.has(`${s}-${i}`)) i++;
    return `${s}-${i}`;
  };
  const addVenue = async () => {
    if (!validate()) {
      notify("Please fix the errors and try again", { color: "red" });
      return;
    }
    
    try {
      const existingSlugs = new Set(venues.map((v) => v.slug).filter(Boolean));
      const slug = uniqueSlug(form.name, existingSlugs);
      const venueData = {
        slug,
        name: form.name,
        address: form.address,
        region: form.region || "",
        playerCapacity: Number(form.playerCapacity) || 0,
        spectatorCapacity: form.spectatorCapacity ? Number(form.spectatorCapacity) : 0,
        status: enabled ? "Active" : "Disabled",
        img: imagePreviews[0] || "/img/home-decor-3.jpeg",
        images: imagePreviews,
        sportType: form.sportType,
        surface: form.surface,
        indoor,
        covered,
        amenities: [...amenities],
        contact: {
          name: form.contactName,
          phone: form.contactPhone,
          email: form.contactEmail,
        },
        openHours: form.openHours,
        mapUrl: form.mapUrl,
        legalDocs: legalDocs.map((d) => ({ name: d.name, size: d.size, type: d.type })),
      };
      
      const newVenue = await createVenue(venueData);
      setVenues((v) => [newVenue, ...v]);
      
      // Reset form
      setForm({
        name: "",
        address: "",
        region: "",
        playerCapacity: "",
        spectatorCapacity: "",
        notes: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        openHours: "",
        sportType: "",
        surface: "",
        mapUrl: "",
      });
      setEnabled(true);
      setImagePreviews([]);
      setLegalDocs([]);
      setErrors({});
      setAmenities([]);
      setIndoor(false);
      setCovered(false);
      notify("Venue added successfully", { color: "green" });
      setActiveTab("overview");
    } catch (error) {
      console.error('Failed to add venue:', error);
      notify("Failed to add venue", { color: "red" });
    }
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/lfg-black.png')] bg-cover\tbg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-white text-gray-900 border border-blue-gray-100">
                <MapPinIcon className="h-7 w-7" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  Manage Venues
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  Create and organize playable locations for sessions
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value={activeTab}>
                <TabsHeader>
                  <Tab value="overview" onClick={() => setActiveTab("overview") }>
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Overview
                  </Tab>
                  <Tab value="add" onClick={() => setActiveTab("add") }>
                    <PlusIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Add Venue
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {activeTab === "overview" ? (
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between w-full">
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-1">
                    Venues
                  </Typography>
                  <Typography variant="small" className="font-normal text-blue-gray-500">
                    Browse and manage available venues
                  </Typography>
                </div>
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 relative">
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => setViewMode('grid')}
                    className={`h-8 w-8 transition-all duration-300 ease-in-out relative z-10 ${
                      viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <TableCellsIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    variant="text"
                    color="blue-gray"
                    onClick={() => setViewMode('list')}
                    className={`h-8 w-8 transition-all duration-300 ease-in-out relative z-10 ${
                      viewMode === 'list' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <ListBulletIcon className="h-4 w-4" />
                  </IconButton>
                  {/* Sliding background */}
                  <div 
                    className={`absolute top-1 h-8 w-8 bg-black rounded-md transition-all duration-300 ease-in-out ${
                      viewMode === 'grid' ? 'left-1' : 'left-9'
                    }`}
                  />
                </div>
              </div>
              {viewMode === 'grid' ? (
                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {venues.map((v) => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              ) : (
                <Card className="mt-6">
                  <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                    <table className="w-full min-w-[960px] table-auto">
                      <thead>
                        <tr>
                          {["venue", "owner", "location", "facilities", "verification", "events hosted", "revenue", "rating", "actions"].map((h) => (
                            <th key={h} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                              <Typography variant="small" className="text-xs font-bold uppercase text-blue-gray-400">{h}</Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {venues.map((v, key) => {
                          const className = `py-3 px-5 ${key === venues.length - 1 ? '' : 'border-b border-blue-gray-50'}`;
                          return (
                            <tr key={v.id}>
                              <td className={className}>
                                <div className="flex items-center gap-4">
                                  <Avatar src={v.img} alt={v.name} size="sm" variant="rounded" />
                                  <div>
                                    <Typography variant="small" color="blue-gray" className="font-semibold">{v.name}</Typography>
                                    <Typography className="text-xs text-blue-gray-500">{v.sportType} • {v.surface}</Typography>
                                  </div>
                                </div>
                              </td>
                              <td className={className}>
                                <div>
                                  <Typography className="text-xs font-semibold text-blue-gray-600">{v.owner?.fullName || '—'}</Typography>
                                  <Typography className="text-xs text-blue-gray-500">@{v.owner?.username || '—'}</Typography>
                                </div>
                              </td>
                              <td className={className}>
                                <div>
                                  <Typography className="text-xs font-semibold text-blue-gray-600">{v.city}, {v.province}</Typography>
                                  <Typography className="text-xs text-blue-gray-500">{v.region}</Typography>
                                </div>
                              </td>
                              <td className={className}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">{v.facilities?.length || 0} facilities</Typography>
                              </td>
                              <td className={className}>
                                <Chip 
                                  variant="filled" 
                                  color={
                                    v.verification?.status === 'verified' ? 'green' : 
                                    v.verification?.status === 'pending' ? 'amber' : 
                                    v.verification?.status === 'expired' ? 'red' : 'gray'
                                  } 
                                  value={v.verification?.status || 'unverified'} 
                                  className="py-0.5 px-2 text-[10px] font-medium w-fit capitalize" 
                                />
                              </td>
                              <td className={className}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">{v.eventsHosted?.total || 0}</Typography>
                                <Typography className="text-xs text-blue-gray-500">{v.eventsHosted?.thisMonth || 0} this month</Typography>
                              </td>
                              <td className={className}>
                                <Typography className="text-xs font-semibold text-blue-gray-600">₱{(v.revenue?.total || 0).toLocaleString()}</Typography>
                                <Typography className="text-xs text-blue-gray-500">₱{(v.revenue?.thisMonth || 0).toLocaleString()} this month</Typography>
                              </td>
                              <td className={className}>
                                <div className="flex items-center gap-1">
                                  <Typography className="text-xs font-semibold text-blue-gray-600">{v.reviews?.averageRating || 0}</Typography>
                                  <Typography className="text-xs text-blue-gray-500">({v.reviews?.totalReviews || 0})</Typography>
                                </div>
                              </td>
                              <td className={className}>
                                <div className="flex items-center gap-1">
                                  <Link href={`/dashboard/venues/${v.slug || ''}`}>
                                    <IconButton variant="text" size="sm" color="blue">
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </IconButton>
                                  </Link>
                                  <IconButton variant="text" size="sm" color="green">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </IconButton>
                                  <IconButton variant="text" size="sm" color="red">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </IconButton>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              )}
            </div>
          ) : (
            <div className="px-4 pb-4">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Add Venue
              </Typography>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl">
                <div className="flex flex-col gap-4">
                  <Input label="Venue name" value={form.name} onChange={onChange("name")} crossOrigin={undefined} />
                  {errors.name && (
                    <Typography variant="small" className="-mt-3 text-red-600">{errors.name}</Typography>
                  )}
                  <Input label="Address" value={form.address} onChange={onChange("address")} crossOrigin={undefined} icon={<MapPinIcon className="h-5 w-5 text-blue-gray-400" />} />
                  {errors.address && (
                    <Typography variant="small" className="-mt-3 text-red-600">{errors.address}</Typography>
                  )}
                  <Select label="Region" value={form.region} onChange={(val) => setForm((f) => ({ ...f, region: val || "" }))}>
                  <Option value="NCR">NCR</Option>
                  <Option value="Region I">Region I</Option>
                  <Option value="Region III">Region III</Option>
                  <Option value="Region VII">Region VII</Option>
                </Select>
                  {errors.region && (
                    <Typography variant="small" className="-mt-2 text-red-600">{errors.region}</Typography>
                  )}
                  <Input type="number" label="Capacity" value={form.capacity} onChange={onChange("capacity")} crossOrigin={undefined} />
                  {errors.capacity && (
                    <Typography variant="small" className="-mt-3 text-red-600">{errors.capacity}</Typography>
                  )}
                  <Textarea label="Notes" value={form.notes} onChange={onChange("notes")} />

                  <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Amenities</Typography>
                    <div className="flex flex-wrap gap-2">
                      {amenitiesOptions.map((opt) => {
                        const active = amenities.includes(opt);
                        return (
                          <Chip
                            key={opt}
                            value={opt}
                            size="sm"
                            color="gray"
                            variant={active ? "filled" : "outlined"}
                            className={`cursor-pointer rounded-full w-[100px] h-[24px] text-center flex items-center justify-center ${
                              active ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 border-gray-300'
                            }`}
                            onClick={() =>
                              setAmenities((arr) =>
                                arr.includes(opt) ? arr.filter((x) => x !== opt) : [...arr, opt]
                              )
                            }
                          />
                        );
                      })}
                      {amenities.filter(a => !amenitiesOptions.includes(a)).map((opt) => (
                        <Chip
                          key={opt}
                          value={opt}
                          size="sm"
                          color="gray"
                          variant="filled"
                          className="cursor-pointer rounded-full w-[100px] h-[24px] text-center flex items-center justify-center bg-gray-800 text-white"
                          onClick={() => setAmenities((arr) => arr.filter((x) => x !== opt))}
                        />
                      ))}
                      <button
                        onClick={() => setCustomAmenityOpen(true)}
                        className="inline-flex items-center justify-center gap-1 text-[10px] font-medium rounded-full border-2 border-dashed border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer w-[100px] h-[24px]"
                      >
                        <PlusIcon className="h-3 w-3" />
                        Add Custom
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between rounded-lg border border-blue-gray-100 p-4">
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium">Venue Status</Typography>
                        <Typography variant="small" className="text-blue-gray-500">{enabled ? "Enabled" : "Disabled"}</Typography>
                      </div>
                      <Switch checked={enabled} onChange={() => setEnabled((v) => !v)} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-blue-gray-100 p-4">
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium">Indoor</Typography>
                        <Typography variant="small" className="text-blue-gray-500">{indoor ? "Yes" : "No"}</Typography>
                      </div>
                      <Switch checked={indoor} onChange={() => { setIndoor((v) => !v); if (!indoor) setCovered(false); }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-blue-gray-100 p-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">Covered</Typography>
                      <Typography variant="small" className="text-blue-gray-500">{covered ? "Yes" : "No"}</Typography>
                    </div>
                    <Switch checked={covered} onChange={() => setCovered((v) => !v)} disabled={indoor} />
                  </div>

                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Typography variant="small" color="blue-gray" className="font-medium">Images</Typography>
                    <Typography variant="small" className="text-blue-gray-500">{imagePreviews.length} / {MAX_IMAGES}</Typography>
                  </div>
                  <label
                    className="flex h-48 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-gray-100 bg-gray-50 hover:bg-gray-100"
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                    onDrop={onDropUpload}
                  >
                    <input type="file" accept={ACCEPTED_TYPES.join(',')} multiple className="hidden" onChange={onImagesChange} />
                    <span className="text-blue-gray-400">Click or drag & drop images (max {MAX_IMAGES})</span>
                  </label>
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                      {imagePreviews.map((src, i) => (
                        <div
                          key={i}
                          className="relative overflow-hidden rounded-lg border border-blue-gray-100"
                          draggable
                          onDragStart={() => onDragStartImage(i)}
                          onDragOver={onDragOverImage}
                          onDrop={() => onDropImage(i)}
                          title="Drag to reorder"
                        >
                          <img src={src} alt={`preview-${i}`} className="h-32 w-full object-cover select-none" />
                          <IconButton
                            variant="text"
                            color="red"
                            size="sm"
                            className="!absolute right-1 top-1 bg-white/80"
                            onClick={() => removeImage(i)}
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-0">
                  <div className="mb-2 flex items-center justify-between">
                    <Typography variant="small" color="blue-gray" className="font-medium">Legal Documents</Typography>
                    <Typography variant="small" className="text-blue-gray-500">{legalDocs.length} / {MAX_DOCS}</Typography>
                  </div>
                  <label
                    className="flex h-28 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-gray-100 bg-gray-50 hover:bg-gray-100"
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer?.files || []);
                      const remain = MAX_DOCS - legalDocs.length;
                      if (remain <= 0) return notify(`Maximum of ${MAX_DOCS} documents reached`, { color: 'red', icon: true });
                      const valid = files.filter((f) => DOC_TYPES.includes(f.type) && f.size <= MAX_DOC_SIZE_MB * 1024 * 1024);
                      if (valid.length < files.length) notify('Some documents were invalid (type/size)', { color: 'amber', icon: true });
                      const chosen = valid.slice(0, remain);
                      setLegalDocs((arr) => [...arr, ...chosen.map((f) => ({ name: f.name, size: f.size, type: f.type }))]);
                    }}
                  >
                    <input
                      type="file"
                      accept={DOC_TYPES.join(',')}
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const remain = MAX_DOCS - legalDocs.length;
                        if (remain <= 0) return notify(`Maximum of ${MAX_DOCS} documents reached`, { color: 'red', icon: true });
                        const valid = files.filter((f) => DOC_TYPES.includes(f.type) && f.size <= MAX_DOC_SIZE_MB * 1024 * 1024);
                        if (valid.length < files.length) notify('Some documents were invalid (type/size)', { color: 'amber', icon: true });
                        const chosen = valid.slice(0, remain);
                        setLegalDocs((arr) => [...arr, ...chosen.map((f) => ({ name: f.name, size: f.size, type: f.type }))]);
                      }}
                    />
                    <span className="text-blue-gray-400">Upload PDF/DOC/DOCX (max {MAX_DOCS}, {MAX_DOC_SIZE_MB}MB each)</span>
                  </label>
                  {legalDocs.length > 0 && (
                    <div className="mt-3 divide-y divide-blue-gray-50 rounded-lg border border-blue-gray-100">
                      {legalDocs.map((d, i) => (
                        <div key={`${d.name}-${i}`} className="flex items-center justify-between gap-3 p-3">
                          <div className="min-w-0">
                            <Typography variant="small" color="blue-gray" className="font-medium truncate max-w-[260px]">{d.name}</Typography>
                            <Typography variant="small" className="text-blue-gray-500">{(d.size / 1024 / 1024).toFixed(2)} MB</Typography>
                          </div>
                          <IconButton variant="text" color="red" size="sm" onClick={() => setLegalDocs((arr) => arr.filter((_, idx) => idx !== i))}>
                            <XMarkIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6">
                <Button color="black" className="flex items-center gap-2 normal-case w-fit" onClick={addVenue}>
                  <PlusIcon className="h-5 w-5" />
                  Add Venue
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editOpen} handler={() => setEditOpen(false)} size="sm">
        <DialogHeader>Edit Venue</DialogHeader>
        <DialogBody divider>
          {current && (
            <div className="flex flex-col gap-4">
              <Input label="Venue name" defaultValue={current.name} onChange={(e) => setCurrent((c) => ({ ...c, name: e.target.value }))} crossOrigin={undefined} />
              <Input label="Address" defaultValue={current.address} onChange={(e) => setCurrent((c) => ({ ...c, address: e.target.value }))} crossOrigin={undefined} />
              <div className="flex items-center justify-between rounded-lg border border-blue-gray-100 p-3">
                <Typography variant="small">Status</Typography>
                <Switch checked={current.status === 'Active'} onChange={() => setCurrent((c) => ({ ...c, status: c.status === 'Active' ? 'Disabled' : 'Active' }))} />
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setEditOpen(false)} className="mr-1">Cancel</Button>
          <Button variant="gradient" color="blue" onClick={() => {
            if (!current) return;
            setVenues((arr) => arr.map((x) => x.id === current.id ? { ...x, name: current.name, address: current.address, status: current.status } : x));
            setEditOpen(false);
            notify('Venue updated', { color: 'green' });
          }}>Save</Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} handler={() => setDeleteOpen(false)} size="xs">
        <DialogHeader>Delete Venue</DialogHeader>
        <DialogBody divider>
          <Typography variant="small">Are you sure you want to delete this venue? This action cannot be undone.</Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setDeleteOpen(false)} className="mr-1">Cancel</Button>
          <Button variant="gradient" color="red" onClick={() => {
            if (!current) return;
            setVenues((arr) => arr.filter((x) => x.id !== current.id));
            setDeleteOpen(false);
            notify('Venue deleted', { color: 'green' });
          }}>Delete</Button>
        </DialogFooter>
      </Dialog>

      {/* Custom Amenity Modal */}
      <Dialog open={customAmenityOpen} handler={() => setCustomAmenityOpen(false)} size="xs">
        <DialogHeader>Add Custom Amenity</DialogHeader>
        <DialogBody divider>
          <Input 
            label="Amenity name" 
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customAmenity.trim()) {
                const trimmed = customAmenity.trim();
                if (!amenities.includes(trimmed) && !amenitiesOptions.includes(trimmed)) {
                  setAmenities((arr) => [...arr, trimmed]);
                  setCustomAmenity("");
                  setCustomAmenityOpen(false);
                  notify('Custom amenity added', { color: 'green' });
                } else {
                  notify('Amenity already exists', { color: 'amber' });
                }
              }
            }}
            crossOrigin={undefined}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => {
            setCustomAmenity("");
            setCustomAmenityOpen(false);
          }} className="mr-1">Cancel</Button>
          <Button 
            variant="gradient" 
            color="black" 
            onClick={() => {
              if (customAmenity.trim()) {
                const trimmed = customAmenity.trim();
                if (!amenities.includes(trimmed) && !amenitiesOptions.includes(trimmed)) {
                  setAmenities((arr) => [...arr, trimmed]);
                  setCustomAmenity("");
                  setCustomAmenityOpen(false);
                  notify('Custom amenity added', { color: 'green' });
                } else {
                  notify('Amenity already exists', { color: 'amber' });
                }
              }
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Venues;
