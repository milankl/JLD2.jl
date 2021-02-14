var documenterSearchIndex = {"docs":
[{"location":"customserialization/#Custom-Serialization-(Experimental)","page":"Custom Serialization","title":"Custom Serialization (Experimental)","text":"","category":"section"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"Version v0.3.0 of introduces support for custom serialization. For now this feature is considered experimental as it passes tests but  has little testing in the wild. → Please test and report if you encounter problems.","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"The API is simple enough, to enable custom serialization for your type A you define a new type e.g. ASerialization that contains the fields you want to store and define JLD2.writeas(::Type{A}) = ASerialization. Internally JLD2 will call Base.convert when writing and loading, so you need to make sure to extend that for your type.","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"struct A\n    x::Int\nend\n\nstruct ASerialization\n    x::Vector{Int}\nend\n\nJLD2.writeas(::Type{A}) = ASerialization\nBase.convert(::Type{ASerialization}, a::A) = ASerialization([a.x])\nBase.convert(::Type{A}, a::ASerialization) = A(only(a.x))","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"If you do not want to overload Base.convert then you can also define","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"JLD2.wconvert(::Type{ASerialization}, a::A) = ASerialization([a.x])\nJLD2.rconvert(::Type{A}, a::ASerialization) = A(only(a.x))","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"instead. This may be particularly relevant when types are involved that are not your own.","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"struct B\n    x::Float64\nend\n\nJLD2.writeas(::Type{B}) = Float64\nJLD2.wconvert(::Type{Float64}, b::B) = b.x\nJLD2.rconvert(::Type{B}, x::Float64) = B(x)\n\narr = [B(rand()) for i=1:10]\n\n@save \"test.jld2\" arr","category":"page"},{"location":"customserialization/","page":"Custom Serialization","title":"Custom Serialization","text":"In this example JLD2 converts the array of B structs to a plain Vector{Float64} prior to  storing to disk.","category":"page"},{"location":"hdf5compat/#HDF5-Compatibility","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"","category":"section"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"JLD2 is built upon the HDF5 Format Specification and produces files that are compatible with the official HDF5 C library.","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"This has the advantage that other libraries that use HDF5 such as the Julia wrapper HDF5.jl or  even with h5py using Python. In addition to that, adhering to the HDF5 standards allows you to use the file introspection tools  such as h5dump and h5debug provided by the HDF5 group.","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"warning: Warning\nGeneral compatibility only holds for a list of basic types:     - Numbers FloatXX, IntXX and UIntXX     - Strings     - Arrays of those types Other structures can in principle also be decoded but may involve work.  See below for more information","category":"page"},{"location":"hdf5compat/#Understanding-how-Julia-structs-are-encoded","page":"HDF5 Compatibility","title":"Understanding how Julia structs are encoded","text":"","category":"section"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"The HDF5 standard supports so-called compound datatypes that comprise of a set of  already known datatypes. This is very similar to julia's structs.  When a user wants to write a non-default type to disk then JLD2 will create the corresponding compound datatypes and commit them to the file. All custom type definitions in a JLD2 file will be stored  in a _types/ group. This way, the type definitions only needs to be written to the file once and all instances of that struct reference it.","category":"page"},{"location":"hdf5compat/#Example","page":"HDF5 Compatibility","title":"Example","text":"","category":"section"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"julia> using JLD2\n\njulia> struct MyCustomStruct\n       x::Int64\n       y::Float64\n       end\n\njulia> @save \"test.jld2\" a=MyCustomStruct(42, π)","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"Let's see what JLD2 makes out of my simple MyCustomStruct. To do that we view the output of h5dump","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"$> h5dump test.jld2\nHDF5 \"test.jld2\" {\nGROUP \"/\" {\n   GROUP \"_types\" {\n      DATATYPE \"00000001\" H5T_COMPOUND {\n         H5T_STRING {\n            STRSIZE H5T_VARIABLE;\n            STRPAD H5T_STR_NULLPAD;\n            CSET H5T_CSET_UTF8;\n            CTYPE H5T_C_S1;\n         } \"name\";\n         H5T_VLEN { H5T_REFERENCE { H5T_STD_REF_OBJECT }} \"parameters\";\n      }\n         ATTRIBUTE \"julia_type\" {\n            DATATYPE  \"/_types/00000001\"\n            DATASPACE  SCALAR\n            DATA {\n            (0): {\n                  \"Core.DataType\",\n                  ()\n               }\n            }\n         }\n      DATATYPE \"00000002\" H5T_COMPOUND {\n         H5T_STD_I64LE \"x\";\n         H5T_IEEE_F64LE \"y\";\n      }\n         ATTRIBUTE \"julia_type\" {\n            DATATYPE  \"/_types/00000001\"\n            DATASPACE  SCALAR\n            DATA {\n            (0): {\n                  \"Main.MyCustomStruct\",\n                  ()\n               }\n            }\n         }\n   }\n   DATASET \"a\" {\n      DATATYPE  \"/_types/00000002\"\n      DATASPACE  SCALAR\n      DATA {\n      (0): {\n            42,\n            3.14159\n         }\n      }\n   }\n}\n}","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"We can see that the file contains two things at top-level. There is a dataset \"a\" (that is what we wanted to store) and there is a group _types which is where all the necessary type information is stored.","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"You can see that JLD2 committed two compound datatypes. The first one is Core.Datatype which at first seems rather unintuitive. It is needed to tell HDF5 what a serialized  julia datatype looks like (a name and a list of parameters).","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"Below that is the definition of MyCustomStruct with two fields  H5T_STD_I64LE \"x\" and H5T_IEEE_F64LE \"y\" defining the integer field x and the float field y.","category":"page"},{"location":"hdf5compat/#A-note-on-pointers","page":"HDF5 Compatibility","title":"A note on pointers","text":"","category":"section"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"In the julia programming language pointers Ptr are not needed very often. However, when binary dependencies come into play and memory is passed back and forth, pointers do become relevant. Pointers are addresses to locations in memory and thus lose their meaning after a program has terminated.","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"In principle, there is little point in storing a pointer to a file but in order to allow for a more seamless experience JLD2 will, similar to Base.Serialization silently accept pointers. This is useful when storing large structures such as a DifferentialEquations.jl solution object that might contain a pointer somewhere. Upon deserialization any pointer fields are instantiated as null pointers.","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"This is done with just three lines of code utilizing the custom serialization logic and  it is shown here as it serves as a good example for usage of that feature.","category":"page"},{"location":"hdf5compat/","page":"HDF5 Compatibility","title":"HDF5 Compatibility","text":"   writeas(::Type{<:Ptr}) = Nothing\n   wconvert(::Type{Nothing}, ::Ptr) = nothing\n   rconvert(::Type{Ptr{T}}, ::Nothing) where {T} = Ptr{T}()","category":"page"},{"location":"#Julia-Data-Format-JLD2","page":"Basics","title":"Julia Data Format - JLD2","text":"","category":"section"},{"location":"","page":"Basics","title":"Basics","text":"JLD2 saves and loads Julia data structures in a format comprising a subset of HDF5, without any dependency on the HDF5 C library. It typically outperforms the JLD package (sometimes by multiple orders of magnitude) and often outperforms Julia's built-in serializer. While other HDF5 implementations supporting HDF5 File Format Specification Version 3.0 (i.e. libhdf5 1.10 or later) should be able to read the files that JLD2 produces, JLD2 is likely to be incapable of reading files created or modified by other HDF5 implementations. JLD2 does not aim to be backwards or forwards compatible with the JLD package.","category":"page"},{"location":"#Reading-and-writing-data","page":"Basics","title":"Reading and writing data","text":"","category":"section"},{"location":"#@save-and-@load-macros","page":"Basics","title":"@save and @load macros","text":"","category":"section"},{"location":"","page":"Basics","title":"Basics","text":"The @save and @load macros are the simplest way to interact with a JLD2 file. The @save macro writes one or more variables from the current scope to the JLD2 file. For example:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"using JLD2\nhello = \"world\"\nfoo = :bar\n@save \"example.jld2\" hello foo","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"This writes the variables hello and foo to datasets in a new JLD2 file named example.jld2. The @load macro loads variables out of a JLD2 file:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"@load \"example.jld2\" hello foo","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"This assigns the contents of the hello and foo datasets to variables of the same name in the current scope.","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"It is best practice to explicitly name the variables to be loaded and saved from a file, so that it is clear from whence these variables arise. However, for convenience, JLD2 also provides variants of @load and @save that do not require variables to be named explicitly. When called with no variable arguments, @save <filename> writes all variables in the global scope of the current module to file <filename>, while @load <filename> loads all variables in file <filename>. When called with no variable arguments, @load requires that the file name is provided as a string literal, i.e., it is not possible to select the file at runtime.","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"Additional customization is possible using assignment syntax and option passing:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"@save \"example.jld2\" bye=hello bar=foo\n@save \"example.jld2\" {compress=true} hello bar=foo","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"@save\n@load","category":"page"},{"location":"#JLD2.@save","page":"Basics","title":"JLD2.@save","text":"@save filename var1 [var2 ...]\n@save filename {compress=true} var1 name2=var2\n\nWrite one or more variables var1,... from the current scope to a JLD2 file filename.\n\nFor interactive use you can save all variables in the current module's global scope using @save filename. More permanent code should prefer the explicit form to avoid saving unwanted variables.\n\nExample\n\nTo save the string hello and array xs to the JLD2 file example.jld2:\n\nhello = \"world\"\nxs = [1,2,3]\n@save \"example.jld2\" hello xs\n\nFor passing options to the saving command use {}\n\n@save \"example.jld2\" {compress=true} hello xs\n\nFor saving variables under a different name use regular assignment syntax\n\n@save \"example.jld2\" greeting=hello xarray = xs\n\n\n\n\n\n","category":"macro"},{"location":"#JLD2.@load","page":"Basics","title":"JLD2.@load","text":"@load filename var1 [var2 ...]\n\nLoad one or more variables var1,... from JLD2 file filename into the current scope and return a vector of the loaded variable names.\n\nFor interactive use, the form @load \"somefile.jld2\" will load all variables from \"somefile.jld2\" into the current scope. This form only supports literal file names and should be avoided in more permanent code so that it's clear where the variables come from.\n\nExample\n\nTo load the variables hello and foo from the file example.jld2, use\n\n@load \"example.jld2\" hello foo\n\n\n\n\n\n","category":"macro"},{"location":"#save-and-load-functions","page":"Basics","title":"save and load functions","text":"","category":"section"},{"location":"","page":"Basics","title":"Basics","text":"The save and load functions, provided by FileIO, provide an alternative mechanism to read and write data from a JLD2 file. To use these functions, you must say using FileIO; it is not necessary to say using JLD2 since FileIO will determine the correct package automatically.","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"The save function accepts an AbstractDict yielding the key/value pairs, where the key is a string representing the name of the dataset and the value represents its contents:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"using FileIO\nsave(\"example.jld2\", Dict(\"hello\" => \"world\", \"foo\" => :bar))","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"The save function can also accept the dataset names and contents as arguments:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"save(\"example.jld2\", \"hello\", \"world\", \"foo\", :bar)","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"When using the save function, the file extension must be .jld2, since the extension .jld currently belongs to the previous JLD package.","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"If called with a filename argument only, the load function loads all datasets from the given file into a Dict:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"load(\"example.jld2\") # -> Dict{String,Any}(\"hello\" => \"world\", \"foo\" => :bar)","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"If called with a single dataset name, load returns the contents of that dataset from the file:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"load(\"example.jld2\", \"hello\") # -> \"world\"","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"If called with multiple dataset names, load returns the contents of the given datasets as a tuple:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"load(\"example.jld2\", \"hello\", \"foo\") # -> (\"world\", :bar)","category":"page"},{"location":"#File-interface","page":"Basics","title":"File interface","text":"","category":"section"},{"location":"","page":"Basics","title":"Basics","text":"It is also possible to interact with JLD2 files using a file-like interface. The jldopen function accepts a file name and an argument specifying how the file should be opened:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"using JLD2\n\nf = jldopen(\"example.jld2\", \"r\")  # open read-only (default)\nf = jldopen(\"example.jld2\", \"r+\") # open read/write, failing if no file exists\nf = jldopen(\"example.jld2\", \"w\")  # open read/write, overwriting existing file\nf = jldopen(\"example.jld2\", \"a+\") # open read/write, preserving contents of existing file or creating a new file","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"Data can be written to the file using write(f, \"name\", data) or f[\"name\"] = data, or read from the file using read(f, \"name\") or f[\"name\"]. When you are done with the file, remember to call close(f).","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"Like open, jldopen also accepts a function as the first argument, permitting do-block syntax:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"jldopen(\"example.jld2\", \"w\") do file\n    file[\"bigdata\"] = randn(5)\nend","category":"page"},{"location":"#Groups","page":"Basics","title":"Groups","text":"","category":"section"},{"location":"","page":"Basics","title":"Basics","text":"It is possible to construct groups within a JLD2 file, which may or may not be useful for organizing your data. You can create groups explicitly:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"jldopen(\"example.jld2\", \"w\") do file\n    mygroup = JLD2.Group(file, \"mygroup\")\n    mygroup[\"mystuff\"] = 42\nend","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"or implicitly, by saving a variable with a name containing slashes as path delimiters:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"jldopen(\"example.jld2\", \"w\") do file\n    file[\"mygroup/mystuff\"] = 42\nend\n# or save(\"example.jld2\", \"mygroup/mystuff\", 42)","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"Both of these examples yield the same group structure, which you can see at the REPL:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"julia> file = jldopen(\"example.jld2\", \"r\")\nJLDFile /Users/simon/example.jld2 (read-only)\n └─📂 mygroup\n    └─🔢 mystuff","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"Similarly, you can access groups directly:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"jldopen(\"example.jld2\", \"r\") do file\n    @assert file[\"mygroup\"][\"mystuff\"] == 42\nend","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"or using slashes as path delimiters:","category":"page"},{"location":"","page":"Basics","title":"Basics","text":"@assert load(\"example.jld2\", \"mygroup/mystuff\") == 42","category":"page"},{"location":"internals/#Internal-and-Design","page":"Internals & Design","title":"Internal & Design","text":"","category":"section"},{"location":"internals/","page":"Internals & Design","title":"Internals & Design","text":"Modules = [JLD2]","category":"page"},{"location":"internals/#JLD2.CustomSerialization","page":"Internals & Design","title":"JLD2.CustomSerialization","text":"CustomSerialization{T,S}\n\nOn-disk representation for data that is written as if it were of Julia type T, but is read as type S.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.GlobalHeap","page":"Internals & Design","title":"JLD2.GlobalHeap","text":"GlobalHeap\n\nRepresents an HDF5 global heap structure.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.Group","page":"Internals & Design","title":"JLD2.Group","text":"Group{T}\n\nJLD group object.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.Group-Tuple{JLD2.JLDFile,AbstractString}","page":"Internals & Design","title":"JLD2.Group","text":"Group(f::JLDFile, name::AbstractString)\n\nConstruct an empty group named name at the top level of JLDFile f.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.Group-Union{Tuple{T}, Tuple{JLD2.Group{T},AbstractString}} where T","page":"Internals & Design","title":"JLD2.Group","text":"Group(g::Group, name::AbstractString)\n\nConstruct a group named name as a child of group g.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.H5Datatype","page":"Internals & Design","title":"JLD2.H5Datatype","text":"H5Datatype\n\nSupertype of all HDF5 datatypes.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.IndirectPointer","page":"Internals & Design","title":"JLD2.IndirectPointer","text":"IndirectPointer\n\nWhen writing data, we may need to enlarge the memory mapping, which would invalidate any memory addresses arising from the old mmap pointer. IndirectPointer holds a pointer to the startptr field of an MmapIO, and the offset relative to that pointer. It defers computing a memory address until converted to a Ptr{T}, so the memory mapping can be enlarged and addresses will remain valid.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.InlineUnionEl","page":"Internals & Design","title":"JLD2.InlineUnionEl","text":"InlineUnionEl{T1,T2}(mask::UInt8, t1::T1, t2::T2)\n\nCustom serialization struct for two member isbits union fields e.g. in other structs or arrays. To indicate that t1 is relevant the mask takes the value UInt8(0) and for t2 UInt8(255)\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.JLDFile","page":"Internals & Design","title":"JLD2.JLDFile","text":"JLDFile{T<:IO}\n\nJLD file object.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.JLDWriteSession","page":"Internals & Design","title":"JLD2.JLDWriteSession","text":"JLDWriteSession{T}\n\nA JLDWriteSession keeps track of references to serialized objects. If T is a Dict, h5offset maps an object ID (returned by calling objectid) to th RelOffset of the written dataset. If it is Union{}, then references are not tracked, and objects referenced multiple times are written multiple times.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.ReadRepresentation","page":"Internals & Design","title":"JLD2.ReadRepresentation","text":"ReadRepresentation{T,ODR}\n\nA type encoding both the Julia type T and the on-disk (HDF5) representation ODR.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.RelOffset","page":"Internals & Design","title":"JLD2.RelOffset","text":"RelOffset\n\nRepresents an HDF5 relative offset. This differs from a file offset (used elsewhere) in that it is relative to the superblock base address. In practice, this means that FILE_HEADER_LENGTHhas been subtracted. fileoffset and h5offset convert between RelOffsets and file offsets.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.TypeMappingException","page":"Internals & Design","title":"JLD2.TypeMappingException","text":"constructrr(f::JLDFile, T::DataType, dt::CompoundType, attrs::Vector{ReadAttribute},             hard_failure::Bool=false)\n\nConstructs a ReadRepresentation for a given type. This is the generic method for all types not specially handled below.\n\nIf hard_failure is true, then throw a TypeMappingException instead of attempting reconstruction. This helps in cases where we can't know if reconstructed parametric types will have a matching memory layout without first inspecting the memory layout.\n\n\n\n\n\n","category":"type"},{"location":"internals/#JLD2.behead-Tuple{UnionAll}","page":"Internals & Design","title":"JLD2.behead","text":"behead(T)\n\nGiven a UnionAll type, recursively eliminates the where clauses\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.construct_array-Union{Tuple{T}, Tuple{IO,Type{T},Int64}} where T","page":"Internals & Design","title":"JLD2.construct_array","text":"construct_array{T}(io::IO, ::Type{T}, ndims::Int)\n\nConstruct array by reading ndims dimensions from io. Assumes io has already been seeked to the correct position.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.fileoffset-Tuple{JLD2.JLDFile,JLD2.RelOffset}","page":"Internals & Design","title":"JLD2.fileoffset","text":"fileoffset(f::JLDFile, x::RelOffset)\n\nConverts an offset x relative to the superblock of file f to an absolute offset.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.group_payload_size-Tuple{Any}","page":"Internals & Design","title":"JLD2.group_payload_size","text":"group_payload_size(pairs)\n\nReturns the size of a group payload, including link info, group info, and link messages, but not the object header. pairs is an iterator of String => RelOffset pairs. Provides space after the last object message for a continuation message.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.h5offset-Tuple{JLD2.JLDFile,Int64}","page":"Internals & Design","title":"JLD2.h5offset","text":"h5offset(f::JLDFile, x::RelOffset)\n\nConverts an absolute file offset x to an offset relative to the superblock of file f.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.jld_finalizer-Tuple{JLD2.JLDFile{JLD2.MmapIO}}","page":"Internals & Design","title":"JLD2.jld_finalizer","text":"jld_finalizer(f::JLDFile)\n\nWhen a JLDFile is finalized, it is possible that the MmapIO has been munmapped, since Julia does not guarantee finalizer order. This means that the underlying file may be closed before we get a chance to write to it.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.jldopen","page":"Internals & Design","title":"JLD2.jldopen","text":"jldopen(fname::AbstractString, mode::AbstractString; iotype=MmapIO, compress=false)\n\nOpens a JLD2 file at path fname.\n\n\"r\": Open for reading only, failing if no file exists \"r+\": Open for reading and writing, failing if no file exists \"w\"/\"w+\": Open for reading and writing, overwriting the file if it already exists \"a\"/\"a+\": Open for reading and writing, creating a new file if none exists, but               preserving the existing file if one is present\n\n\n\n\n\n","category":"function"},{"location":"internals/#JLD2.link_size-Tuple{String}","page":"Internals & Design","title":"JLD2.link_size","text":"link_size(name::String)\n\nReturns the size of a link message, including message header.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.links_size-Tuple{Any}","page":"Internals & Design","title":"JLD2.links_size","text":"links_size(pairs)\n\nReturns the size of several link messages. pairs is an iterator of String => RelOffset pairs.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.load_datatypes-Tuple{JLD2.JLDFile}","page":"Internals & Design","title":"JLD2.load_datatypes","text":"load_datatypes(f::JLDFile)\n\nPopulate f.datatypes and f.jlh5types with all of the committed datatypes from a file. We need to do this before writing to make sure we reuse written datatypes.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.lookup_offset-Tuple{JLD2.Group,AbstractString}","page":"Internals & Design","title":"JLD2.lookup_offset","text":"lookup_offset(g::Group, name::AbstractString) -> RelOffset\n\nLookup the offset of a dataset in a group. Returns UNDEFINED_ADDRESS if the dataset is not present. Does not inspect unwritten_child_groups.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.pathize-Tuple{JLD2.Group,AbstractString,Bool}","page":"Internals & Design","title":"JLD2.pathize","text":"pathize(g::Group, name::AbstractString, create::Bool) -> Tuple{Group,String}\n\nConverts a path to a group and name object. If create is true, any intermediate groups will be created, and the dataset name will be checked for uniqueness with existing names.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.prewrite-Tuple{JLD2.JLDFile}","page":"Internals & Design","title":"JLD2.prewrite","text":"prewrite(f::JLDFile)\n\nCheck that a JLD file is actually writable, and throw an error if not. Sets the written flag on the file.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.read_array!","page":"Internals & Design","title":"JLD2.read_array!","text":"read_array!(v::Array, f::JLDFile, rr)\n\nFill the array v with the contents of JLDFile f at the current position, assuming a ReadRepresentation rr.\n\n\n\n\n\n","category":"function"},{"location":"internals/#JLD2.read_attr_data-Tuple{JLD2.JLDFile,JLD2.ReadAttribute,JLD2.H5Datatype,JLD2.ReadRepresentation}","page":"Internals & Design","title":"JLD2.read_attr_data","text":"read_attr_data(f::JLDFile, attr::ReadAttribute, expected_datatype::H5Datatype,\n               rr::ReadRepresentation)\n\nRead data from an attribute, assuming a specific HDF5 datatype and ReadRepresentation. If the HDF5 datatype does not match, throws an UnsupportedFeatureException. This allows better type stability while simultaneously validating the data.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.read_attr_data-Tuple{JLD2.JLDFile,JLD2.ReadAttribute}","page":"Internals & Design","title":"JLD2.read_attr_data","text":"read_attr_data(f::JLDFile, attr::ReadAttribute)\n\nRead data from an attribute.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.read_compressed_array!","page":"Internals & Design","title":"JLD2.read_compressed_array!","text":"read_compressed_array!(v::Array, f::JLDFile, rr, data_length::Int)\n\nFill the array v with the compressed contents of JLDFile f at the current position, assuming a ReadRepresentation rr and that the compressed data has length data_length.\n\n\n\n\n\n","category":"function"},{"location":"internals/#JLD2.read_data","page":"Internals & Design","title":"JLD2.read_data","text":"read_data(f::JLDFile, dataspace::ReadDataspace, datatype_class::UInt8,\n          datatype_offset::Int64, data_offset::Int64[, filter_id::UInt16,\n          header_offset::RelOffset, attributes::Vector{ReadAttribute}])\n\nRead data from a file. If datatype_class is typemax(UInt8), the datatype is assumed to be committed, and datatype_offset points to the offset of the committed datatype's header. Otherwise, datatype_offset points to the offset of the datatype attribute.\n\n\n\n\n\n","category":"function"},{"location":"internals/#JLD2.read_scalar","page":"Internals & Design","title":"JLD2.read_scalar","text":"read_scalar(f::JLDFile, rr, header_offset::RelOffset)\n\nRead raw data representing a scalar with read representation rr from the current position of JLDFile f. header_offset is the RelOffset of the object header, used to resolve cycles.\n\n\n\n\n\n","category":"function"},{"location":"internals/#JLD2.read_size-Tuple{IO,UInt8}","page":"Internals & Design","title":"JLD2.read_size","text":"read_size(io::IO, flags::UInt8)\n\nLoads a variable-length size according to flags Expects that the first two bits of flags mean: 0   The size of the Length of Link Name field is 1 byte. 1   The size of the Length of Link Name field is 2 bytes. 2   The size of the Length of Link Name field is 4 bytes. 3   The size of the Length of Link Name field is 8 bytes. Returns the size as an Int\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.save_group-Tuple{JLD2.Group}","page":"Internals & Design","title":"JLD2.save_group","text":"save_group(g::Group) -> RelOffset\n\nStores a group to a file, updating it if it has already been saved. Returns UNDEFINED_ADDRESS if the group was already stored, or the offset of the new group otherwise.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.symbol_length-Tuple{Symbol}","page":"Internals & Design","title":"JLD2.symbol_length","text":"symbol_length(x::Symbol)\n\nReturns the length of the string represented by x.\n\n\n\n\n\n","category":"method"},{"location":"internals/#JLD2.@load-Tuple{Any,Vararg{Any,N} where N}","page":"Internals & Design","title":"JLD2.@load","text":"@load filename var1 [var2 ...]\n\nLoad one or more variables var1,... from JLD2 file filename into the current scope and return a vector of the loaded variable names.\n\nFor interactive use, the form @load \"somefile.jld2\" will load all variables from \"somefile.jld2\" into the current scope. This form only supports literal file names and should be avoided in more permanent code so that it's clear where the variables come from.\n\nExample\n\nTo load the variables hello and foo from the file example.jld2, use\n\n@load \"example.jld2\" hello foo\n\n\n\n\n\n","category":"macro"},{"location":"internals/#JLD2.@save-Tuple{Any,Vararg{Any,N} where N}","page":"Internals & Design","title":"JLD2.@save","text":"@save filename var1 [var2 ...]\n@save filename {compress=true} var1 name2=var2\n\nWrite one or more variables var1,... from the current scope to a JLD2 file filename.\n\nFor interactive use you can save all variables in the current module's global scope using @save filename. More permanent code should prefer the explicit form to avoid saving unwanted variables.\n\nExample\n\nTo save the string hello and array xs to the JLD2 file example.jld2:\n\nhello = \"world\"\nxs = [1,2,3]\n@save \"example.jld2\" hello xs\n\nFor passing options to the saving command use {}\n\n@save \"example.jld2\" {compress=true} hello xs\n\nFor saving variables under a different name use regular assignment syntax\n\n@save \"example.jld2\" greeting=hello xarray = xs\n\n\n\n\n\n","category":"macro"}]
}
